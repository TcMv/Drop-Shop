'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheck, FiTruck, FiZap, FiShoppingBag, FiPackage } from 'react-icons/fi';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <FiCheck className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-[var(--color-text-primary)] mb-2">
          Payment Successful! 🎉
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-2">
          Your order has been placed and is now being processed.
        </p>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-8">
          {sessionId && (
            <>Order ref: <span className="text-[var(--color-brand-400)] font-mono">{sessionId.slice(-8)}</span></>
          )}
        </p>

        <div className="p-5 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border-default)] mb-8 text-sm space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <FiCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[var(--color-text-secondary)] block">Payment confirmed</span>
              {sessionId && (
                <span className="text-xs text-[var(--color-text-tertiary)]">via Stripe</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(251,191,36,0.1)] flex items-center justify-center shrink-0">
              <FiTruck className="w-4 h-4 text-[var(--color-brand-400)]" />
            </div>
            <div>
              <span className="text-[var(--color-text-secondary)] block">Processing for shipping</span>
              <span className="text-xs text-[var(--color-text-tertiary)]">Estimated 5-14 business days</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(251,191,36,0.1)] flex items-center justify-center shrink-0">
              <FiZap className="w-4 h-4 text-[var(--color-brand-400)]" />
            </div>
            <div>
              <span className="text-[var(--color-text-secondary)] block">AI agent notified</span>
              <span className="text-xs text-[var(--color-text-tertiary)]">Order tracking will be sent to your email</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(251,191,36,0.1)] flex items-center justify-center shrink-0">
              <FiPackage className="w-4 h-4 text-[var(--color-brand-400)]" />
            </div>
            <div>
              <span className="text-[var(--color-text-secondary)] block">Afterpay instalment active</span>
              <span className="text-xs text-[var(--color-text-tertiary)]">If you used Afterpay, manage instalments in the Afterpay app</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--color-text-tertiary)] mb-6">
          A confirmation email will be sent to your inbox shortly.
        </p>

        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <FiShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
