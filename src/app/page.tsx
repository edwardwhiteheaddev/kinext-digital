/**
  * File: src/app/page.tsx
  * Purpose: The homepage of the application.
  * File Structure:
  *  - Imports
  *  - Component Definition
  */
import AuthButtons from './_components/AuthButtons';

export default function Home() {
  return (
    <main>
      <h1>Kinext Digital</h1>
      <p>Welcome to the Kinext Digital website!</p>
      <AuthButtons />
    </main>
  );
}