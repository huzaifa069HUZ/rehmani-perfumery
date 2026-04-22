import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Rahmani Perfumery. Visit our store in Patna or reach out via our contact form for inquiries about our premium Arabian attars and perfumes.',
};

export default function ContactPage() {
  return <ContactClient />;
}
