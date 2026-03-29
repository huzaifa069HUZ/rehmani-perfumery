export interface Product {
  id: number;
  name: string;
  category: string;
  notes: string;
  price: number;
  sizes: number[];
  images: string[];
  isNew: boolean;
  occasions: string[];
}

const MOCKUP2 = '/assets/mockup2.png';

export const products: Product[] = [
  {
    id: 1,
    name: 'Royal Oud',
    category: 'oud',
    notes: 'Oud • Amber • Musk',
    price: 899,
    sizes: [6, 12, 24],
    images: ['/assets/luxury_attar_bottle_1_1773444423078.png', MOCKUP2, '/assets/luxury_attar_bottle_3_1773444475959.png'],
    isNew: true,
    occasions: ['long lasting', 'festival'],
  },
  {
    id: 2,
    name: 'Midnight Musk',
    category: 'musk',
    notes: 'White Musk • Vanilla • Sandalwood',
    price: 649,
    sizes: [6, 12],
    images: ['/assets/luxury_attar_bottle_2_1773444458042.png', MOCKUP2, '/assets/luxury_attar_bottle_1_1773444423078.png'],
    isNew: false,
    occasions: ['daily wear', 'seductive', 'party'],
  },
  {
    id: 3,
    name: 'Sicilian Citrus',
    category: 'citrus',
    notes: 'Bergamot • Lemon • Vetiver',
    price: 549,
    sizes: [6, 12, 24],
    images: ['/assets/luxury_attar_bottle_3_1773444475959.png', MOCKUP2, '/assets/luxury_attar_bottle_1_1773444423078.png'],
    isNew: true,
    occasions: ['daily wear', 'festival'],
  },
  {
    id: 4,
    name: 'Velvet Rose',
    category: 'floral',
    notes: 'Damask Rose • Patchouli • Jasmine',
    price: 799,
    sizes: [6, 12],
    images: ['/assets/luxury_attar_bottle_1_1773444423078.png', MOCKUP2, '/assets/luxury_attar_bottle_3_1773444475959.png'],
    isNew: false,
    occasions: ['seductive', 'party', 'daily wear'],
  },
  {
    id: 5,
    name: 'Amiri Blend',
    category: 'oud',
    notes: 'Aged Oud • Saffron • Leather',
    price: 1299,
    sizes: [12, 24],
    images: ['/assets/luxury_attar_bottle_2_1773444458042.png', MOCKUP2, '/assets/luxury_attar_bottle_3_1773444475959.png'],
    isNew: false,
    occasions: ['long lasting', 'festival', 'party'],
  },
  {
    id: 6,
    name: 'Jasmine Pearl',
    category: 'floral',
    notes: 'Night Jasmine • Ylang Ylang • Tuberose',
    price: 599,
    sizes: [6, 12],
    images: ['/assets/luxury_attar_bottle_3_1773444475959.png', MOCKUP2, '/assets/luxury_attar_bottle_2_1773444458042.png'],
    isNew: false,
    occasions: ['daily wear', 'festival'],
  },
  {
    id: 7,
    name: 'Amber Noir',
    category: 'musk',
    notes: 'Dark Amber • Tonka Bean • Labdanum',
    price: 849,
    sizes: [6, 12, 24],
    images: ['/assets/luxury_attar_bottle_1_1773444423078.png', MOCKUP2, '/assets/luxury_attar_bottle_2_1773444458042.png'],
    isNew: true,
    occasions: ['seductive', 'long lasting', 'party'],
  },
  {
    id: 8,
    name: 'Neroli Blanc',
    category: 'citrus',
    notes: 'Neroli • Orange Blossom • Cedarwood',
    price: 699,
    sizes: [6, 12],
    images: ['/assets/luxury_attar_bottle_2_1773444458042.png', MOCKUP2, '/assets/luxury_attar_bottle_1_1773444423078.png'],
    isNew: false,
    occasions: ['daily wear'],
  },
];
