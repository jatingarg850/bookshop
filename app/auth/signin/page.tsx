'use client';

import { Suspense } from 'react';
import { Card } from '@/components/ui/Card';
import { SignInForm } from '@/app/auth/signin-form';

export default function SignInPage() {
  return (
    <div className="container-max py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="font-heading text-2xl font-bold mb-6 text-center">Sign In</h1>
          <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
            <SignInForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
