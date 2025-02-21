'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link';
import TermsAndConditions from './TermsAndConditions'; // Import
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { firebaseApp } from '@/lib/firebase'; // Import firebaseApp


/**
 * A component for email/password login and registration, Google, Facebook and phone auth.
 */
const AuthButtons = () => {
    const { data: session, status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [register, setRegister] = useState(false);
    const [name, setName] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [newsletterSubscription, setNewsletterSubscription] = useState(false);
    const [showTerms, setShowTerms] = useState(false); // State for showing terms
    const router = useRouter();

    // --- Phone Auth States ---
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<any>(null); // Use any for now

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
            callbackUrl: '/',
        });

        if (result?.error) {
            setError('Invalid credentials');
        } else if (result?.ok) {
            router.replace('/');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!termsAccepted) {
            setError('You must accept the terms and conditions.');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, termsAccepted, newsletterSubscription, phoneNumber }),
            });

            if (response.ok) {
                console.log('User registered successfully');
                setRegister(false);  // Switch to login form
                const result = await signIn('credentials', { // Auto-login
                    email,
                    password,
                    redirect: false,
                    callbackUrl: '/',
                });
                if (result?.error) {
                    setError("Unable to login new user");
                } else if (result?.ok) {
                    router.replace('/');
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setError('Registration failed');
        }
    };

    // --- Firebase Phone Auth Functions ---

    const setupRecaptcha = () => {
        const auth = getAuth(firebaseApp);
        // @ts-ignore
        if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
            // @ts-ignore
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible', // Make reCAPTCHA invisible
                'callback': (response: any) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    console.log("reCAPTCHA verified", response); // Log the response
                },
                'expired-callback': () => {
                    console.warn("reCAPTCHA expired");
                    setError("reCAPTCHA verification expired. Please try again.");
                },
                'error-callback': (error: any) => {
                    console.error("reCAPTCHA error:", error);
                    setError("reCAPTCHA verification failed. Please try again.");
                }
            });
        }
    };

    const handlePhoneSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phoneNumber) {
            setError("Please enter a phone number.");
            return;
        }

        const auth = getAuth(firebaseApp);
        if (!auth.currentUser) {
            setupRecaptcha();
        }


        try {
            // @ts-ignore
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(confirmationResult);
            setShowVerificationInput(true); // Show verification code input
            console.log("SMS Sent");
        } catch (error: any) { // Use type any for error
            console.error('Error sending verification code:', error);
            // @ts-ignore
            window.recaptchaVerifier.clear(); // Reset reCAPTCHA
            // Provide more specific error messages based on the error code
            if (error.code === 'auth/invalid-phone-number') {
                setError('Invalid phone number format.  Use E.164 format (e.g., +15551234567).');
            } else if (error.code === 'auth/too-many-requests') {
                setError('Too many requests.  Please try again later.');
            } else {
                setError('Failed to send verification code: ' + error.message); // Show Firebase error
            }
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!confirmationResult || !verificationCode) {
            setError("Please enter the verification code.");
            return;
        }

        try {
            const result = await confirmationResult.confirm(verificationCode);
            console.log("Phone Auth Result:", result.user);

            // Use NextAuth to create a session (IMPORTANT)
            // We use the 'credentials' provider with a *placeholder* email and password.
            const nextAuthResult = await signIn('credentials', {
                redirect: false,
                callbackUrl: '/', // Add this line
                email: result.user.phoneNumber!, // Use the phone number as email
                password: 'phone-auth-placeholder', // Placeholder password
            });


            if (nextAuthResult?.error) {
                setError("Failed to create session. Please sign in again.");
                await signOut(); // Sign out from Firebase in case of an error.
            } else if (nextAuthResult?.ok) {
                router.replace('/');
            }
        } catch (error: any) { // Use type any for error
            console.error('Error verifying code:', error);
            // Provide more specific error messages
            if (error.code === 'auth/invalid-verification-code') {
                setError('Invalid verification code. Please try again.');
            } else if (error.code === 'auth/code-expired') {
                setError('Verification code has expired. Please request a new code.');
            } else {
                setError('Error verifying code: ' + error.message); // Show Firebase error message
            }
        }
    };


    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (session) {
        return (
            <div className="space-y-4">
                <p>Signed in as {session.user?.email}</p>
                {/*@ts-ignore*/}
                <p>Role: {session.user?.role ?? 'User'}</p>
                {/*@ts-ignore*/}
                <p>ID: {session.user?.id ?? 'No ID'}</p> {/* Display user ID */}
                <Button onClick={() => signOut()}>Sign out</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            {!register ? (
                // --- Login Form ---
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>
                    <Button type="submit" variant="default">Sign in with Email</Button>
                    <Button variant="outline" onClick={() => setRegister(true)}>Register</Button>
                </form>
            ) : (
                // --- Registration Form ---
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            id='name'
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id='email'
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type='password'
                            id='password'
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>
                    <div className="flex items-center">
                        <Checkbox
                            id="terms"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(checked === true)} // Use onCheckedChange
                            className="mr-2"
                        />
                        <Label htmlFor="terms">
                            I accept the <Link href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-blue-500 hover:underline">terms and conditions</Link>
                        </Label>
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="newsletter"
                            checked={newsletterSubscription}
                            onCheckedChange={(checked) => setNewsletterSubscription(checked === true)} //Use onCheckedChange
                            className="mr-2"
                        />
                        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                    </div>
                    <Button type="submit">Register</Button>
                    <Button variant="outline" onClick={() => setRegister(false)}>Back to Login</Button>
                </form>
            )}
            {/* --- Phone Sign-In Form --- */}
            {!showVerificationInput ? (
                <form onSubmit={handlePhoneSignIn} className="space-y-4">
                    <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            type="tel"
                            id="phoneNumber"
                            placeholder="Phone Number (e.g., +15551234567)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="mt-1"
                        />
                        <div id="recaptcha-container"></div>
                    </div>
                    <Button type="submit" variant="default">Sign in with Phone</Button>
                </form>
            ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div>
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <Input
                            type="text"
                            id="verificationCode"
                            placeholder="Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>
                    <Button type="submit" variant="default">Verify Code</Button>
                </form>
            )}
            <hr />
            <Button onClick={() => signIn('google')} variant="default">
                Sign in with Google
            </Button>
            <Button onClick={() => signIn('facebook')} variant="default">
                Sign in with Facebook
            </Button>
            {showTerms && (
                <TermsAndConditions onClose={() => setShowTerms(false)} />
            )}
        </div>
    );
};

export default AuthButtons;