import { SignIn } from '@clerk/clerk-react';

export default function SignInPrompt({ redirectUrl }) {
  return (
    <div className="max-w-md mx-auto mt-10">
      <SignIn redirectUrl={redirectUrl} />
    </div>
  );
}
