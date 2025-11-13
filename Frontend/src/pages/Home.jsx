import { SignedIn, SignedOut } from '@clerk/clerk-react';
import WelcomeBanner from '../components/UI/WelcomeBanner';
import SignInPrompt from '../components/UI/SignInPrompt';

export function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">
      <SignedOut>
        <WelcomeBanner />
        <SignInPrompt redirectUrl="/doctors" />
      </SignedOut>
      <SignedIn>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">You're signed in!</h2>
          <p className="text-gray-600">Visit the Doctors page to book your appointment.</p>
        </div>
      </SignedIn>
    </div>
  );
}
