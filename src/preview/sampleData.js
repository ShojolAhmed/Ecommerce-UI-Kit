const img = (seed) => `https://picsum.photos/seed/${seed}/400/400`

export const sampleProducts = [
  { id: 1, title: 'Canvas Backpack', price: 59.0, category: 'Bags', image: img('backpack') },
  { id: 2, title: 'Wireless Headphones', price: 129.99, category: 'Audio', image: img('headphones') },
  { id: 3, title: 'Ceramic Mug', price: 18.5, category: 'Home', image: img('mug') },
]
