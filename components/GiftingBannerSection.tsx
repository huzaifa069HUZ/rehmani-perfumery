'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import giftboxImg from '@/public/assets/giftbox-section.png';

export default function GiftingBannerSection() {
  return (
    <section className="relative w-full bg-white">
      <Link href="/gifting" className="block w-full cursor-pointer group">
        <div className="relative w-full">
          <Image
            src={giftboxImg}
            alt="Exclusive Gifting Collection"
            className="w-full h-auto"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 z-10 pointer-events-none" />
        </div>
      </Link>
    </section>
  );
}
