import { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Secure Checkout | Rahmani Perfumery',
  description: 'Securely complete your purchase at Rahmani Perfumery.',
};

export default function CheckoutPage() {
  return (
    <main className="bg-[#f8fafc]">
      {/* We can hide standard header/footer if we want, but usually retaining header is fine. 
          The CheckoutForm component contains the checkout UI. */}
      <CheckoutForm />
    </main>
  );
}
