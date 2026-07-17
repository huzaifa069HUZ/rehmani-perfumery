import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Revalidate the feed every hour
export const revalidate = 3600;

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    const rows = ['id\ttitle\tdescription\tlink\timage_link\tprice\tavailability\tbrand\tcondition'];
    
    for (const p of products) {
      const id = p.id;
      const title = p.name || 'Unknown Product';
      // Provide a solid fallback description if notes are missing
      const description = p.notes 
        ? `${p.notes} - Premium ${p.category || 'fragrance'}` 
        : `${title} - Premium ${p.category || 'fragrance'} by Rahmani Perfumery. Authentic, rich, and long-lasting.`;
      
      const link = `https://rahmaniperfumery.com/product/${id}`;
      
      // Ensure image link is absolute URL
      const image_link = p.images && p.images.length > 0 
        ? (p.images[0].startsWith('http') ? p.images[0] : `https://rahmaniperfumery.com${p.images[0]}`)
        : 'https://rahmaniperfumery.com/icon.png';
        
      const priceVal = p.price || 0;
      const price = `${priceVal.toFixed(2)} INR`;
      
      // Default to in_stock unless explicitly marked false
      const availability = p.inStock === false ? 'out_of_stock' : 'in_stock';
      const brand = 'Rahmani Perfumery';
      const condition = 'new';
      
      // Make sure there are no newlines in description or title which would break TSV
      const cleanTitle = title.replace(/[\t\n\r]/g, ' ');
      const cleanDesc = description.replace(/[\t\n\r]/g, ' ');

      rows.push(`${id}\t${cleanTitle}\t${cleanDesc}\t${link}\t${image_link}\t${price}\t${availability}\t${brand}\t${condition}`);
    }

    const tsv = rows.join('\n');

    return new Response(tsv, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    return new Response('Error generating feed', { status: 500 });
  }
}
