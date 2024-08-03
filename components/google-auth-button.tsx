'use client';

import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { Icons } from './icons';

export default function GoogleSignInButton() {
  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}