import { sampleProducts } from '../sampleData.js'

/**
 * Demo content for the footers and homepage sections (a small home-and-wardrobe store).
 * The photos are placeholders from picsum.photos, so they need an internet connection;
 * the components fall back to a plain tinted frame when an image does not load.
 */
const picture = (seed, width, height) => `https://picsum.photos/seed/${seed}/${width}/${height}`

export const sampleAnnouncements = [
  { id: 'ship', text: 'Free delivery on orders over $75.', href: '#shipping', linkLabel: 'See delivery options' },
  { id: 'autumn', text: 'The autumn edit is in: knitwear, throws and candles.', href: '#autumn-edit', linkLabel: 'Shop the edit' },
  { id: 'returns', text: 'Changed your mind? Return anything within 30 days.', href: '#returns', linkLabel: 'Returns policy' },
]

export const sampleHero = {
  badge: 'Autumn edit',
  title: 'Warm layers for slower mornings',
  description:
    'Merino, linen and waxed canvas, made in small batches and built to be worn for years rather than one season.',
  primaryAction: { label: 'Shop knitwear', href: '#knitwear' },
  secondaryAction: { label: 'Read the story', href: '#journal' },
  footnote: 'Free delivery over $75. Free returns for 30 days.',
  image: { src: picture('hero-knitwear', 1000, 1250), alt: 'A folded merino sweater on a wooden bench' },
  wideImage: { src: picture('hero-wide', 1920, 1100), alt: 'A sunlit living room with a linen throw on a sofa' },
}

export const sampleCategories = [
  { id: 'knitwear', label: 'Knitwear', count: 48, href: '#knitwear', image: picture('cat-knitwear', 900, 900) },
  { id: 'bags', label: 'Bags & travel', count: 22, href: '#bags', image: picture('cat-bags', 600, 600) },
  { id: 'kitchen', label: 'Kitchen & table', count: 36, href: '#kitchen', image: picture('cat-kitchen', 600, 600) },
  { id: 'leather', label: 'Leather goods', count: 17, href: '#leather', image: picture('cat-leather', 600, 600) },
  { id: 'gifts', label: 'Gifts under $50', count: 41, href: '#gifts', image: picture('cat-gifts', 600, 600) },
]

const featuredNames = [
  'Merino Crewneck Sweater',
  'Waxed Canvas Weekender Bag',
  'Stoneware Pour-Over Set',
  'Linen Throw Blanket',
  'Cashmere Scarf',
  'Hand-Poured Soy Candle',
  'Leather Card Holder',
  'Mulberry Silk Pillowcase',
]
export const sampleFeaturedProducts = featuredNames
  .map((name) => sampleProducts.find((product) => product.name === name))
  .filter(Boolean)

export const samplePromo = {
  badge: 'This weekend',
  title: 'Take 20% off your first order',
  description: 'Use the code at checkout on anything in the autumn edit. One use per customer.',
  code: 'FIRST20',
  primaryAction: { label: 'Start shopping', href: '#autumn-edit' },
  footnote: 'Excludes gift cards and sale items. Ends Sunday at midnight.',
  image: { src: picture('promo-table', 1000, 800), alt: 'A table set for breakfast with stoneware cups' },
}

export const sampleTestimonials = [
  {
    id: 't1',
    quote: 'The sweater has been through a dozen washes and still looks new. It is the one I reach for every morning.',
    author: 'Amira Rahman',
    role: 'Verified buyer, Merino Crewneck',
    rating: 5,
  },
  {
    id: 't2',
    quote: 'Arrived in two days, packed without a single piece of plastic. The weekender bag is better made than bags twice the price.',
    author: 'Daniel Okafor',
    role: 'Verified buyer, Weekender Bag',
    rating: 5,
  },
  {
    id: 't3',
    quote: 'I needed a different size and support sorted the exchange in one email. That is rare.',
    author: 'Mei Lin',
    role: 'Verified buyer, Cashmere Scarf',
    rating: 4,
  },
  {
    id: 't4',
    quote: 'The pour-over set is the nicest thing on my counter. Everyone who visits asks where it is from.',
    author: 'Tomás Herrera',
    role: 'Verified buyer, Pour-Over Set',
    rating: 5,
  },
]

export const sampleFaq = [
  {
    id: 'delivery',
    question: 'How long does delivery take?',
    answer: 'Orders ship within one working day. Standard delivery takes 2 to 4 working days and express takes 1 to 2. Delivery is free on orders over $75.',
  },
  {
    id: 'returns',
    question: 'Can I return something I have worn or tried on?',
    answer: 'Yes. You can return anything within 30 days if it is unwashed and in its original condition. Start a return from your account and we email you a prepaid label.',
  },
  {
    id: 'care',
    question: 'How do I wash the merino knitwear?',
    answer: 'Machine wash cold on the wool cycle, then dry flat. Avoid fabric softener, which coats the fibres and makes them pill.',
  },
  {
    id: 'sizing',
    question: 'What if my size is out of stock?',
    answer: 'Open the product page and choose "Email me when it is back". Most sizes return within three weeks.',
  },
  {
    id: 'payment',
    question: 'Which payment methods do you accept?',
    answer: 'All major cards, bank transfer and digital wallets. You are charged when your order ships, not when you place it.',
  },
]

export const sampleFooter = {
  brand: {
    name: 'Northwind',
    href: '#home',
    description: 'Clothing and home goods made in small batches from natural materials, and repaired for free.',
  },
  columns: [
    {
      id: 'shop',
      title: 'Shop',
      links: [
        { label: 'New arrivals', href: '#new' },
        { label: 'Knitwear', href: '#knitwear' },
        { label: 'Bags & travel', href: '#bags' },
        { label: 'Kitchen & table', href: '#kitchen' },
        { label: 'Gift cards', href: '#gift-cards' },
      ],
    },
    {
      id: 'help',
      title: 'Help',
      links: [
        { label: 'Delivery', href: '#shipping' },
        { label: 'Returns', href: '#returns' },
        { label: 'Size guide', href: '#sizes' },
        { label: 'Track an order', href: '#track' },
        { label: 'Contact us', href: '#contact' },
      ],
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { label: 'Our story', href: '#about' },
        { label: 'Materials', href: '#materials' },
        { label: 'Repairs', href: '#repairs' },
        { label: 'Careers', href: '#careers' },
      ],
    },
  ],
  social: [
    { platform: 'instagram', href: 'https://instagram.com/' },
    { platform: 'facebook', href: 'https://facebook.com/' },
    { platform: 'youtube', href: 'https://youtube.com/' },
    { platform: 'x', href: 'https://x.com/' },
  ],
  legalLinks: [
    { label: 'Privacy', href: '#privacy' },
    { label: 'Terms', href: '#terms' },
    { label: 'Cookies', href: '#cookies' },
  ],
  newsletter: {
    title: 'One email a month',
    description: 'New arrivals, restocks and the occasional story from the workshop. No more than that.',
  },
}
