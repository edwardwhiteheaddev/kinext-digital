/**
  * File: init-kinext-digital.ts
  * Purpose: Initializes a new Next.js application and installs required dependencies.
  * File Structure:
  *  - Script Constants
  *  - Main Function: initializeNextApp
  *  - Helper Functions: executeCommand
  * Function Comments: Each function includes detailed JSDoc comments.
  * Class Comments: N/A (no classes in this script)
  * Step-by-step instructions for setup and deployment to Firebase Hosting are included in the comments.
  */

import { execSync } from 'child_process';
import * as fs from 'fs';

/**
 * Executes a command in the shell synchronously.
 * @param command The command to execute.
 * @param ignoreError Whether to ignore errors or throw them. Defaults to false.
 * @throws Error if the command execution fails and ignoreError is false.
 */
const executeCommand = (command: string, ignoreError = false) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
        if (!ignoreError) {
            throw error;
        }
    }
};

/**
 * Initializes a new Next.js application, installs dependencies in stages, and sets up Storybook.
 * @throws Error if any of the steps fail.
 */
const initializeNextApp = () => {
    const projectName = 'kinext-digital';

    // --- Step 1: Create the Next.js app (minimal options) ---
    //console.log(`Creating Next.js application: ${projectName}`);
    //executeCommand(`npx create-next-app@latest ${projectName} --typescript --use-npm --eslint --app --src-dir --no-tailwind --import-alias "@/*"`);


    // --- Step 2: Change directory ---
    //process.chdir(projectName);
    console.log(`Changed directory to: ${projectName}`);

    // --- Step 3: Install Dependencies in Stages ---

    // Stage 1: Core Dependencies (React, ReactDOM, Next.js related)
    console.log('Installing core dependencies...');
    executeCommand(`npm install --legacy-peer-deps react@latest react-dom@latest @types/react@latest @types/react-dom@latest`);

    // Stage 2: Mantine Dependencies
    console.log('Installing Shadcn UI dependencies...');
    executeCommand(`npm install --legacy-peer-deps @radix-ui/react-slot@latest class-variance-authority@latest clsx@latest lucide-react@latest tailwind-merge@latest tailwindcss-animate@latest`);

    // Stage 3: Authentication and Database
    console.log('Installing Authentication and Database dependencies...');
    executeCommand(`npm install --legacy-peer-deps next-auth@latest firebase@latest firebase-admin@latest mongodb@latest`);

    // Stage 4: State Management
    console.log('Installing State Management dependencies...');
    executeCommand(`npm install --legacy-peer-deps zustand@latest`);

    // Stage 5: Testing Libraries
    console.log('Installing Testing Libraries...');
    executeCommand(`npm install --legacy-peer-deps --save-dev jest@latest jest-environment-jsdom@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest @types/jest@latest`);


    // Stage 6: Documentation Tools
    console.log('Installing Documentation Tools...');
    executeCommand(`npm install --legacy-peer-deps --save-dev typedoc@latest typedoc-plugin-markdown@latest`);

    // Stage 7: Storybook and Addons - Installed *before* initialization
    console.log('Installing Storybook and addons...');
    executeCommand(`npm install --legacy-peer-deps --save-dev storybook@latest @storybook/addon-essentials@latest @storybook/addon-interactions@latest @storybook/addon-links@latest @storybook/addon-onboarding@latest @storybook/blocks@latest @storybook/nextjs@latest @storybook/react@latest @storybook/test@latest`);

    // --- Step 4: Initialize Storybook ---
    console.log('Initializing Storybook...');
    executeCommand('npx storybook@latest init --yes', true); // Added --yes to automatically answer prompts


    // --- Step 5: Create a basic tsconfig.json ---
    console.log('Creating/Updating tsconfig.json');
    const tsconfig = {
        "compilerOptions": {
            "target": "es5",
            "lib": ["dom", "dom.iterable", "esnext"],
            "allowJs": true,
            "skipLibCheck": true,
            "strict": true,
            "noEmit": true,
            "esModuleInterop": true,
            "module": "esnext",
            "moduleResolution": "bundler",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "jsx": "preserve",
            "incremental": true,
            "plugins": [{ "name": "next" }],
            "paths": {
                "@/*": ["./src/*"]
            },
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
    };

    fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
    console.log('tsconfig.json updated.');


    // --- Step 6: Create .env.local file ---
    console.log('Creating .env.local file');
    const envLocalContent = `NEXT_PUBLIC_FIREBASE_CONFIG={} NEXTAUTH_SECRET=`;
    fs.writeFileSync('.env.local', envLocalContent.trim());
    console.log('.env.local file created.');

    // Stage 7: Install dotenv
    console.log('Installing dotenv...');
    executeCommand(`npm install --legacy-peer-deps dotenv@latest`);

    // Stage 8: Install mongodb-adapter
    console.log('Installing mongodb-adapter...');
    executeCommand(`npm install --legacy-peer-deps @next-auth/mongodb-adapter@latest`);

    // Stage 9: Install bycryptjs
    console.log('Installing bcryptjs...');
    executeCommand(`npm install --legacy-peer-deps bcryptjs@latest`);

    // Stage 10: Install cookies-next
    console.log('Installing cookies-next...');
    executeCommand(`npm install --legacy-peer-deps cookies-next@latest`);

    // Stage 11: Install @sindresorhus/fnv1a
    console.log('Installing @sindresorhus/fnv1a...');
    executeCommand(`npm install --legacy-peer-deps @sindresorhus/fnv1a@latest`);

    // Stage 12: Init Shadcn UI
    console.log('Initializing Shadcn UI...');
    executeCommand(`npx shadcn@latest init --yes`, true);

    // Stage 13: Add Shadcn UI components
    console.log('Adding Shadcn UI components...');
    executeCommand(`npx shadcn@latest add button input checkbox label`);

    // Stage 14: Add Next.js themes
    console.log('Adding Next.js themes...');
    executeCommand(`npm install next-themes@latest --legacy-peer-deps`);

    // Stage 15: Add Mongoose
    console.log('Adding Mongoose...');
    executeCommand(`npm install mongoose@latest --legacy-peer-deps`);

    // --- Step 7: Display setup instructions ---
    console.log('\nNext.js application initialized successfully!');
    console.log('\n--- Setup Instructions ---');
    console.log('1. Navigate to the project directory:  cd kinext-digital');
    console.log('2. Start the development server:  npm run dev');
    console.log('\n--- Firebase Hosting Deployment Instructions ---');
    console.log('1. **Install Firebase CLI:** `npm install -g firebase-tools`');
    console.log('2. **Login to Firebase:** `firebase login`');
    console.log('3. **Initialize Firebase in your project:** `firebase init hosting`');
    console.log('   - Select "Use an existing project" and choose your Firebase project.');
    console.log('   - For "public directory", enter "out" (Next.js export output).');
    console.log('   - Configure as a single-page app (rewrite all URLs to /index.html): Yes.');
    console.log('   - Set up automatic builds and deploys with GitHub? (Optional)');
    console.log('4. **Build your Next.js application for production:** `npm run build`');
    console.log('5. **Export your static site:** `npm run export` This will generate an `out` folder.');
    console.log('6. **Deploy to Firebase Hosting:** `firebase deploy`');
    console.log('\nYour website will be deployed to the Firebase Hosting URL provided in the console.');
};

// Run the initialization function.
initializeNextApp();