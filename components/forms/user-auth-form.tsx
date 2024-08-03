'use client';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GoogleSignInButton from '../google-auth-button';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const onSubmit = async (data: UserFormValue) => {
    signIn('credentials', {
      email: data.email,
      callbackUrl: '/dashboard'
    });
  };

  return (
    <>
      <GoogleSignInButton />
    </>
  );
}