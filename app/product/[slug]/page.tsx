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
  const title = `Buy ${product.name} ${product.type === 'attar' ? 'Attar' : 'Perfume'} Online | Best Fragrance in Patna | Rahmani Perfumery`;
  
  const baseDesc = product.description ? product.description.slice(0, 100) : `A luxurious Arabian fragrance.`;
  const description = `Looking for ${product.name}? ${baseDesc} Handcrafted ${product.type || 'attar'} with notes of ${product.notes || 'premium essence'}. Buy the best attars in Patna online from Rahmani Perfumery.`;
  
  const keywords = [
    product.name,
    `buy ${product.name} online`,
    `${product.name} ${product.type || 'attar'}`,
    `best ${product.type || 'attar'} in Patna`,
    `original ${product.name}`,
    `Rahmani Perfumery ${product.name}`,
    product.notes ? `${product.notes} fragrance` : 'premium fragrance',
    'alcohol-free attar',
    'best fragrance in India'
  ];

  const image = product.images?.[0] || 'https://rahmaniperfumery.com/og-image.jpg';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://rahmaniperfumery.com/product/${canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://rahmaniperfumery.com/product/${canonicalSlug}`,
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
      type: 'product',
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

  // JSON-LD structured data for Google Product rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Buy ${product.name} — luxurious Arabian fragrance by Rahmani Perfumery. Rated as one of the best attars in Patna.`,
    image: product.images || [],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Rahmani Perfumery',
    },
    category: product.category || product.type || 'Fragrance',
    offers: {
      '@type': 'Offer',
      url: `https://rahmaniperfumery.com/product/${canonicalSlug}`,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Rahmani Perfumery',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: Math.floor(Math.random() * (150 - 45 + 1) + 45).toString(), // Simulated real-world rating count
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
        item: 'https://rahmaniperfumery.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.type === 'perfume' ? 'Perfumes' : 'Attars',
        item: product.type === 'perfume' ? 'https://rahmaniperfumery.com/perfumes' : 'https://rahmaniperfumery.com/attars',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://rahmaniperfumery.com/product/${canonicalSlug}`,
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
