'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Design tokens ── */
const GOLD = '#c9a55a';
const HF = "font-['Impact','Arial_Black',sans-serif]";

export default function AboutContentSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── 1. Headline letter-by-letter reveal ── */
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        gsap.fromTo(words,
          { y: 100, opacity: 0, rotateX: -40 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── 2. Grid cards stagger ── */
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.grid-card');
        gsap.fromTo(cards,
          { y: 80, opacity: 0, scale: 0.92 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── 3. Stats counter ── */
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll('.stat-item');
        gsap.fromTo(statItems,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── 4. Tagline reveal ── */
      if (taglineRef.current) {
        gsap.fromTo(taglineRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: taglineRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── 5. CTA slide up ── */
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#fff',
        borderRadius: '28px 28px 0 0',
        marginTop: -28,
        overflow: 'hidden',
      }}
    >

      {/* ── BLOCK 1: Hero Headline ── */}
      <section style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: GOLD,
          marginBottom: 20,
        }}>
          RAHMANI PERFUMERY
        </p>

        <h2
          ref={headlineRef}
          className={HF}
          style={{
            fontSize: 'clamp(2.2rem, 10vw, 4rem)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            perspective: '600px',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          <span className="word" style={{ display: 'inline-block', marginRight: '0.2em' }}>BEYOND</span>
          <span className="word" style={{ display: 'inline-block', marginRight: '0.2em', color: GOLD }}>ORDINARY</span>
          <br />
          <span className="word" style={{ display: 'inline-block', marginRight: '0.2em' }}>FRAGRANCE.</span>
          <br />
          <span className="word" style={{ display: 'inline-block', marginRight: '0.2em', color: GOLD }}>ALWAYS.</span>
        </h2>

        <p style={{
          fontSize: 13,
          lineHeight: 1.8,
          color: '#888',
          maxWidth: 380,
          margin: '28px auto 0',
        }}>
          Rethinking Arabian formulation techniques to forge uncompromised, hyper-durable profiles. Bottled strictly without alcohol.
        </p>
      </section>

      {/* ── BLOCK 2: Animated Product Grid ── */}
      <section style={{ padding: '20px 16px 40px' }}>
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {/* Card 1 — Large, spans full width */}
          <div
            className="grid-card"
            style={{
              gridColumn: '1 / -1',
              background: '#f5f3ef',
              borderRadius: 20,
              padding: '32px 24px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            {/* Background image */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '55%', height: '100%',
              opacity: 0.15,
            }}>
              <Image src="/assets/chrome-figure-v2nobg.png" alt="" fill style={{ objectFit: 'contain', objectPosition: 'right center' }} />
            </div>
            <p style={{
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: GOLD,
              marginBottom: 8,
              position: 'relative', zIndex: 1,
            }}>ALCOHOL-FREE ATTARS</p>
            <h3 className={HF} style={{
              fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
              lineHeight: 1,
              color: '#0a0a0a',
              textTransform: 'uppercase',
              position: 'relative', zIndex: 1,
            }}>
              PURE.<br /><span style={{ color: GOLD }}>POTENT.</span><br />TIMELESS.
            </h3>
          </div>

          {/* Card 2 */}
          <div
            className="grid-card"
            style={{
              background: '#0a0a0a',
              borderRadius: 20,
              padding: '24px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 200,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', bottom: -10, right: -10, width: '70%', height: '60%',
              opacity: 0.25,
            }}>
              <Image src="/assets/category_attar.png" alt="" fill style={{ objectFit: 'cover', borderRadius: '16px' }} />
            </div>
            <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: GOLD, position: 'relative', zIndex: 1 }}>
              IMPORTED PERFUMES
            </p>
            <h3 className={HF} style={{ fontSize: '1.2rem', lineHeight: 1.1, color: '#fff', textTransform: 'uppercase', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
              LONG LASTING<br /><span style={{ color: GOLD }}>PROJECTION</span>
            </h3>
          </div>

          {/* Card 3 */}
          <div
            className="grid-card"
            style={{
              background: `linear-gradient(135deg, #f9f6f0, #efe9dd)`,
              borderRadius: 20,
              padding: '24px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 200,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', bottom: -10, right: -10, width: '65%', height: '55%',
              opacity: 0.2,
            }}>
              <Image src="/assets/bakhoor.png" alt="" fill style={{ objectFit: 'cover', borderRadius: '16px' }} />
            </div>
            <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: GOLD, position: 'relative', zIndex: 1 }}>
              BAKHOOR & OUD
            </p>
            <h3 className={HF} style={{ fontSize: '1.2rem', lineHeight: 1.1, color: '#0a0a0a', textTransform: 'uppercase', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
              HOME<br /><span style={{ color: GOLD }}>FRAGRANCE</span>
            </h3>
          </div>

          {/* Card 4 — Full width gift pack */}
          <div
            className="grid-card"
            style={{
              gridColumn: '1 / -1',
              background: 'linear-gradient(135deg, #1a1510, #2c2620)',
              borderRadius: 20,
              padding: '28px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              minHeight: 120,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', right: 0, top: 0, width: '40%', height: '100%', opacity: 0.15,
            }}>
              <Image src="/assets/giftbox.png" alt="" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: GOLD, marginBottom: 6 }}>
                EXCLUSIVE
              </p>
              <h3 className={HF} style={{ fontSize: '1.3rem', lineHeight: 1.1, color: '#fff', textTransform: 'uppercase' }}>
                RAMADAN & EID<br /><span style={{ color: GOLD }}>GIFT PACKS</span>
              </h3>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', border: `1.5px solid ${GOLD}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              position: 'relative', zIndex: 1,
            }}>
              <span style={{ color: GOLD, fontSize: 20 }}>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOCK 3: Stats ── */}
      <section
        ref={statsRef}
        style={{
          padding: '40px 24px',
          display: 'flex',
          justifyContent: 'center',
          gap: 0,
          borderTop: '1px solid #eee',
          borderBottom: '1px solid #eee',
        }}
      >
        {[
          { value: '50+', label: 'YEARS OF\nHERITAGE' },
          { value: '500+', label: 'HAPPY\nCUSTOMERS' },
          { value: '100+', label: 'PREMIUM\nPRODUCTS' },
          { value: '0%', label: 'ALCOHOL\nFORMULA' },
        ].map((stat, i) => (
          <div
            key={i}
            className="stat-item"
            style={{
              flex: 1,
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid #eee' : 'none',
              padding: '0 8px',
            }}
          >
            <p className={HF} style={{
              fontSize: 'clamp(1.5rem, 6vw, 2rem)',
              color: GOLD,
              lineHeight: 1,
              marginBottom: 6,
            }}>
              {stat.value}
            </p>
            <p style={{
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#999',
              textTransform: 'uppercase',
              lineHeight: 1.4,
              whiteSpace: 'pre-line',
            }}>
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* ── BLOCK 4: Tagline — "Wear confidence..." ── */}
      <section
        ref={taglineRef}
        style={{
          padding: '60px 24px',
          textAlign: 'center',
          background: '#faf9f7',
        }}
      >
        <p style={{ fontSize: 22, color: GOLD, marginBottom: 16 }}>✨</p>
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
            fontWeight: 500,
            lineHeight: 1.35,
            color: '#1a1a1a',
            maxWidth: 400,
            margin: '0 auto',
          }}
        >
          Wear confidence.<br />
          Wear identity.<br />
          <span style={{ color: GOLD }}>Wear memories.</span>
        </h2>
        <p style={{
          fontSize: 12,
          lineHeight: 1.8,
          color: '#999',
          maxWidth: 340,
          margin: '20px auto 0',
        }}>
          Premium Alcohol-Free Attars • Long-Lasting Perfumes • Oud • Bakhoor • Eid Gift Packs
        </p>
      </section>

      {/* ── BLOCK 5: Why Customers Love Us ── */}
      <section style={{ padding: '40px 16px' }}>
        <p style={{
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: GOLD,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          💎 WHY CUSTOMERS LOVE US
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginTop: 20,
        }}>
          {[
            { icon: '✔️', title: 'Strong Projection & Long Lasting' },
            { icon: '✔️', title: 'Premium Quality at Affordable Price' },
            { icon: '✔️', title: 'Perfect for Gifting' },
            { icon: '✔️', title: 'Trusted by Hundreds of Happy Customers' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#f9f7f3',
                borderRadius: 16,
                padding: '18px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                border: '1px solid rgba(200,185,160,0.2)',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BLOCK 6: WhatsApp CTA ── */}
      <section style={{ padding: '8px 16px 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1a0f 0%, #0a120a 100%)',
          borderRadius: 22,
          padding: '24px 20px',
          border: '1px solid rgba(37,211,102,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Green glow */}
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(37,211,102,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#25D366', fontWeight: 700, marginBottom: 2 }}>
                📞 CALL / WHATSAPP NOW
              </p>
              <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>Limited Ramadan Stock Available</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
            <a href="https://wa.me/919234576090" target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: '#fff', borderRadius: 14, padding: '14px 12px',
                fontSize: 12, fontWeight: 700, textDecoration: 'none',
              }}>+91 92345 76090</a>
            <a href="https://wa.me/918540047972" target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(37,211,102,0.12)', color: '#25D366',
                borderRadius: 14, padding: '14px 12px',
                fontSize: 12, fontWeight: 700, border: '1px solid rgba(37,211,102,0.25)',
                textDecoration: 'none',
              }}>+91 85400 47972</a>
          </div>
        </div>
      </section>

      {/* ── BLOCK 7: CTA ── */}
      <section ref={ctaRef} style={{ padding: '16px 16px 48px', textAlign: 'center' }}>
        <Link href="/attars" style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: '#0a0a0a',
              color: '#fff',
              borderRadius: 60,
              padding: '16px 28px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 1,
            }}>
              Explore Our Collection
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </section>
    </div>
  );
}
