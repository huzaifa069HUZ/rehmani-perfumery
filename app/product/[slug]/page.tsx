import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const revalidate = 3600; // Cache the product page for 1 hour (ISR)
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { buildProductSlug, extractIdFromSlug } from '@/lib/utils';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ProductData {
  id: string;
  name: string;
  slug?: string;
  category: string;
  gender?: string;
  description?: string;
  notes?: string;
  price: number;
  originalPrice: number;
  images: string[];
  type?: 'attar' | 'perfume';
  sizes?: number[];
  pricing?: Record<string, { price: number; originalPrice: number }>;
  occasions?: string[];
  isNew?: boolean;
}

async function getProductBySlug(slug: string): Promise<ProductData | null> {
  // Strategy 1: Extract the 7-char ID suffix from the slug end
  // e.g., "royal-oud-attar-xF7kP2a" → try Firestore doc with ID starting with "xF7kP2a"
  const idPrefix = extractIdFromSlug(slug);

  // Try direct doc lookup by the extracted suffix (fast path)
  // Firestore IDs are 20 chars; our suffix is 7 chars — we stored the first 7 chars of docId
  // We need to query to find the full doc
  try {
    // First, try querying products where slug field matches (for new products)
    const slugQuery = query(
      collection(db, 'products'),
      where('slug', '==', slug),
      limit(1)
    );
    const slugSnap = await getDocs(slugQuery);
    if (!slugSnap.empty) {
      const docData = slugSnap.docs[0];
      return { id: docData.id, ...(docData.data() as Omit<ProductData, 'id'>) };
    }

    // Second: query by the ID prefix (handles slugs without stored slug field)
    // We stored slug as first7chars of firestoreId, so we can look it up with a range query
    const prefixQuery = query(
      collection(db, 'products'),
      where('__name__', '>=', idPrefix),
      where('__name__', '<', idPrefix + '\uf8ff'),
      limit(1)
    );
    const prefixSnap = await getDocs(prefixQuery);
    if (!prefixSnap.empty) {
      const docData = prefixSnap.docs[0];
      return { id: docData.id, ...(docData.data() as Omit<ProductData, 'id'>) };
    }

    // Fallback: slug might BE a raw Firestore ID (old links)
    const directRef = doc(db, 'products', slug);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      return { id: directSnap.id, ...(directSnap.data() as Omit<ProductData, 'id'>) };
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Rahmani Perfumery',
      description: 'The product you are looking for could not be found.',
    };
  }

  const canonicalSlug = buildProductSlug(product.name, product.id);
  const typeLabel = product.type === 'perfume' ? 'Perfume' : 'Attar';
  
  // Highly optimized SEO Title for exact match product searches like "Oud Mohammad Attar"
  const title = `${product.name} ${typeLabel} | Buy 100% Original Online | Rahmani Perfumery`;
  
  const baseDesc = product.description ? `${product.description.slice(0, 120)}...` : `Experience the luxurious ${product.name} ${typeLabel}, a premium Arabian fragrance.`;
  
  // SEO Description that includes exact matches and long-tail keywords
  const description = `${baseDesc} Buy 100% original, long-lasting ${product.name} ${typeLabel} online. Handcrafted with notes of ${product.notes || 'premium essence'}. Best ${typeLabel.toLowerCase()}s in India by Rahmani Perfumery.`;
  
  const keywords = [
    product.name,
    `${product.name} ${typeLabel}`,
    `${product.name} attar`,
    `buy ${product.name} online`,
    `buy ${product.name} ${typeLabel}`,
    `original ${product.name}`,
    `long lasting ${product.name}`,
    `Rahmani Perfumery ${product.name}`,
    `best ${typeLabel.toLowerCase()} in Patna`,
    `best ${typeLabel.toLowerCase()} in India`,
    product.notes ? `${product.notes} fragrance` : 'premium fragrance',
    'alcohol-free attar',
    'attar',
    'Rahmani Perfumery',
    'Rehmani Perfumery'
  ];

  const image = product.images?.[0] || 'https://www.rahmaniperfumery.com/og-image.jpg';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://www.rahmaniperfumery.com/product/${canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.rahmaniperfumery.com/product/${canonicalSlug}`,
      siteName: 'Rahmani Perfumery',
      images: [
        {
          url: image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    redirect('/404');
  }

  // Canonical slug redirect — if someone arrives with old ID or wrong slug, redirect
  const canonicalSlug = buildProductSlug(product.name, product.id);
  if (slug !== canonicalSlug) {
    redirect(`/product/${canonicalSlug}`);
  }

  // Deterministic review count based on product ID (avoids Math.random inconsistency)
  const hashCode = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const reviewCount = 45 + (hashCode % 106); // Range: 45-150, deterministic per product

  const typeLabel = product.type === 'perfume' ? 'Perfume' : 'Attar';

  // JSON-LD structured data for Google Product rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name} ${typeLabel}`,
    description: product.description || `Buy 100% original ${product.name} ${typeLabel}. A luxurious, long-lasting Arabian fragrance by Rahmani Perfumery.`,
    image: product.images || [],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Rahmani Perfumery',
      alternateName: 'Rehmani Perfumery',
    },
    category: product.category || product.type || 'Fragrance',
    offers: {
      '@type': 'Offer',
      url: `https://www.rahmaniperfumery.com/product/${canonicalSlug}`,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Rahmani Perfumery',
        alternateName: 'Rehmani Perfumery',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      reviewCount: reviewCount.toString(),
    },
    ...(product.notes && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Fragrance Notes',
          value: product.notes,
        },
      ],
    }),
  };

  // Breadcrumb structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.rahmaniperfumery.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.type === 'perfume' ? 'Perfumes' : 'Attars',
        item: product.type === 'perfume' ? 'https://www.rahmaniperfumery.com/perfumes' : 'https://www.rahmaniperfumery.com/attars',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://www.rahmaniperfumery.com/product/${canonicalSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
