// src/app/_components/TermsAndConditions.tsx
import { Button } from "@/components/ui/button"

interface TermsAndConditionsProps {
    onClose: () => void;
}

export default function TermsAndConditions({ onClose }: TermsAndConditionsProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-[80vh] overflow-auto">
                <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
                <p><strong>Last Updated:</strong> [Date]</p>

                <p>Welcome to Kinext Digital! These Terms and Conditions ("Terms") govern your use of our website,
                    products, and services (collectively, the "Services"). By accessing or using our Services, you agree to be
                    bound by these Terms. If you do not agree to these Terms, please do not use our Services.</p>

                <h2>1. Acceptance of Terms</h2>

                <p>By creating an account, using our website, or purchasing any of our services, you confirm that you
                    accept these Terms and that you agree to comply with them. If you are using our Services on behalf of an
                    organization, you are agreeing to these Terms for that organization and promising that you have the
                    authority to bind that organization to these Terms.</p>

                <h2>2. Changes to Terms</h2>

                <p>We may modify the Terms at any time, in our sole discretion. If we do so, we'll let you know either by
                    posting the modified Terms on the site or through other communications. It's important that you review the
                    Terms whenever we modify them because continuing to use the Services after we have posted modified Terms
                    indicates that you agree to be bound by the modified Terms.</p>

                <h2>3. Privacy Policy</h2>

                <p>Please refer to our Privacy Policy for information on how we collect, use, and disclose information
                    from our users. You acknowledge and agree that your use of the Services is subject to our Privacy
                    Policy.</p>

                <h2>4. Use of Services</h2>

                <h3>4.1 Eligibility</h3>
                <p>You must be at least 18 years old to use our Services. By agreeing to these Terms, you represent and
                    warrant to us that you are at least 18 years old.</p>

                <h3>4.2 Account Registration</h3>
                <p>To access certain features of our Services, you may be required to create an account. You agree to
                    provide accurate, current, and complete information during the registration process and to update such
                    information to keep it accurate, current, and complete.</p>

                <h3>4.3 Account Security</h3>
                <p>You are responsible for safeguarding your password and for any activities or actions under your
                    account. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower
                    case letters, numbers, and symbols) with your account.</p>

                <h2>5. Intellectual Property</h2>

                <h3>5.1 Ownership</h3>
                <p>The Services and its original content, features, and functionality are and will remain the exclusive
                    property of Kinext Digital and its licensors.</p>

                <h3>5.2 Restrictions</h3>
                <p>You may not copy, modify, distribute, sell, or lease any part of our Services, nor may you reverse
                    engineer or attempt to extract the source code of that software, unless laws prohibit these restrictions
                    or you have our written permission.</p>

                <h2>6. Termination</h2>

                <p>We may terminate or suspend your account and bar access to the Services immediately, without prior
                    notice or liability, under our sole discretion, for any reason whatsoever and without limitation,
                    including but not limited to a breach of the Terms.</p>

                <h2>7. Limitation of Liability</h2>

                <p>In no event shall Kinext Digital, nor its directors, employees, partners, agents, suppliers, or
                    affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including
                    without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i)
                    your use of or inability to use the Services; (ii) any unauthorized access to or use of our servers
                    and/or any personal information stored therein.</p>

                <h2>8. Governing Law</h2>

                <p>These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without
                    regard to its conflict of law provisions.</p>

                <h2>9. Contact Us</h2>

                <p>If you have any questions about these Terms, please contact us at: <br />
                    Email: <a href="mailto:info@kinextdigital.com">info@kinextdigital.com</a></p>
                <Button onClick={onClose} variant="default">Close</Button>
            </div>
        </div>
    );
};