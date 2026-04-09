import type { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { buildProductSlug } from '@/lib/utils';

const BASE_URL = 'https://rahmaniperfumery.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/attars`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/perfumes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/auth`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic product routes
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const productRoutes: MetadataRoute.Sitemap = snapshot.docs.map((document) => {
      const data = document.data();
      const slug = buildProductSlug(data.name || 'product', document.id);
      return {
        url: `${BASE_URL}/product/${slug}`,
        lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
    return staticRoutes;
  }
}
