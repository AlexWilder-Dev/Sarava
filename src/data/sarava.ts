// Everything the site says about Sarava lives here: contact details, hours,
// offers, menu, booking options and links. Sources are noted per block; see
// research/notes.md for the full trail.

export type Diet = 'v' | 'vg'

export interface MenuItem {
  name: string
  description?: string
  price: string
  diet?: Diet
  popular?: boolean
  note?: string
}

export interface MenuSection {
  id: string
  title: string
  intro?: string
  /** Sections where every dish can be a flour crêpe or a buckwheat galette. */
  hasBase?: boolean
  items: MenuItem[]
}

export type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'

/** Opening and closing times as minutes after midnight, London time. */
export interface DayHours {
  open: number
  close: number
}

const hm = (h: number, m = 0) => h * 60 + m

export const business = {
  name: 'Sarava',
  fullName: 'Sarava Creperie Bar & Cafe',
  // Google business description and X bio, in their words.
  bio: 'The crêpe artists formerly known as Senzala.',
  tagline: 'French crêpes with Brazilian flair',
  since: 2010,
  // Zideli booking page, in their words.
  description: 'A creperie bar & cafe, offering crepes, tapas, cocktails and more',
  // TripAdvisor / booknbook owner description.
  welcome: 'Food lovers, fussy eaters, gluten-free, vegetarians & vegans, all welcome!',
  galetteLine:
    'Our galettes are not just gluten-free but also lactose, egg and dairy-free and we have organic and vegan wines and beers.',
  address: {
    unit: 'Unit 41–42, Granville Arcade',
    avenue: 'Second Avenue',
    market: 'Brixton Village Market',
    street: '41–42 Coldharbour Lane',
    city: 'London',
    postcode: 'SW9 8PS',
  },
  phone: { display: '020 7274 2211', href: 'tel:+442072742211' },
  email: 'info@senzalacreperie.co.uk',
  instagram: { handle: '@saravabrixton', url: 'https://www.instagram.com/saravabrixton/' },
  geo: { lat: 51.4624699, lng: -0.1116164 },
}

export const links = {
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=Sarava%20Creperie%20Bar%20%26%20Cafe%2C%2041-42%20Coldharbour%20Ln%2C%20London%20SW9%208PS',
  map: 'https://www.google.com/maps/search/?api=1&query=Sarava%20Creperie%20Bar%20%26%20Cafe%2C%20Brixton%20Village',
  deliveroo: 'https://deliveroo.co.uk/menu/london/brixton/senzala-creperie',
  uberEats: 'https://www.ubereats.com/gb/store/senzala-creperie/cyDegljQUbOGfz26XUhnug',
  zideli: 'https://zideli.com/sarava',
}

// Google listing, read 18 October 2026. Not yet confirmed with Sarava.
export const hours: Record<DayKey, DayHours> = {
  mon: { open: hm(10, 30), close: hm(16, 30) },
  tue: { open: hm(10, 30), close: hm(21, 30) },
  wed: { open: hm(10, 30), close: hm(21, 30) },
  thu: { open: hm(10, 30), close: hm(21, 30) },
  fri: { open: hm(10), close: hm(22) },
  sat: { open: hm(10), close: hm(22) },
  sun: { open: hm(10), close: hm(19) },
}

export const dayOrder: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const dayNames: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

// Painted on their window (shopfront photo on their booking page, 2026).
// The board gives no days, so it is shown whenever the bar is open in that window.
export const happyHour = {
  start: hm(16),
  end: hm(19, 30),
  price: '£6',
  line: 'All cocktails £6',
  cocktails: ['Espresso Martini', 'Passion Fruit Caipirinha', 'Chili Margarita', 'Mojito', 'Piña Colada'],
}

// Their Zideli booking page.
export const booking = {
  maxParty: 6,
  holdMinutes: 15,
  types: [
    'Dinner',
    'Drinks',
    'Birthday party',
    'Engagement party',
    'Corporate event',
    'Private hire',
    'Christmas party',
  ],
  optIn: "Be first to know about Sarava's last-minute tables, special evenings and offers",
}

// Google listing attributes.
export const facilities = [
  'Wheelchair-accessible entrance, seating and toilet',
  'Assistive hearing loop',
  'High chairs',
  'Tables out in the arcade',
  'LGBTQ+ friendly',
]

export interface PressQuote {
  quote: string
  source: string
  detail: string
  url: string
}

export const press: Record<'timeout' | 'londonx' | 'village', PressQuote> = {
  timeout: {
    quote:
      '…lively ambience, colourful decor, friendly staff and cosy interior help make it a Brixton Village staple.',
    source: 'Time Out',
    detail: 'Laura Price, March 2020',
    url: 'https://www.timeout.com/london/restaurants/senzala-1',
  },
  londonx: {
    quote: 'They cater really well for food intolerances and dietary requirements.',
    source: 'London x London',
    detail: 'Alastair Reid Schanche, October 2023',
    url: 'https://www.londonxlondon.com/?p=42315',
  },
  village: {
    quote: 'Plus, they make amazing cocktails!',
    source: 'Brixton Village',
    detail: 'Mother’s Day brunch guide',
    url: 'https://brixtonvillage.com/mothers-day-brunch-in-brixton-village/',
  },
}

// Deliveroo menu ("Sarava Creperie & Cafe"), read from the search-engine copy
// in October 2026. Delivery prices: no dine-in menu was published. Obvious
// spelling slips fixed; the Burrata Crepe's "Vegetarian" tag dropped because
// it contains Parma ham.
export const menuSource = 'Prices as listed on Sarava’s Deliveroo menu.'

export const menu: MenuSection[] = [
  {
    id: 'starters',
    title: 'Starters',
    items: [
      {
        name: 'Chicken Caesar Salad',
        description:
          'Grilled chicken, romaine lettuce, croutons, Parmesan, anchovies and our homemade Caesar dressing.',
        price: '17.40',
      },
      { name: 'Garlic Bread', description: 'Grilled bread with garlic butter.', price: '7.30', diet: 'v' },
      {
        name: 'Churrasco',
        description:
          'A Brazilian speciality of grilled sirloin cap steak strips, served with tomato salsa, guacamole, cassava flour, rocket leaves and chargrilled bread.',
        price: '25.60',
      },
      {
        name: 'Illunga Bread',
        description:
          'Grilled bread with homemade pesto, red pepper confit, caramelised onions, olive oil and vinegar.',
        price: '10.20',
        diet: 'vg',
      },
      {
        name: 'Burrata Salad',
        description: 'Fresh tomatoes, burrata, fresh basil, avocado and toast.',
        price: '11.90',
      },
    ],
  },
  {
    id: 'salads',
    title: 'Salads',
    intro: 'Side salad served with maple & mustard dressing.',
    items: [
      {
        name: 'Mixed Leaves Salad',
        description: 'Mixed leaves, cherry tomatoes, black olives, sundried tomatoes.',
        price: '7.80',
        diet: 'vg',
        note: 'Side salad',
      },
      {
        name: 'Ribeiro Salad',
        description:
          'Mixed leaves, grilled goat cheese, crispy bacon, asparagus, courgette, cherry tomatoes, red pepper confit, pine nuts.',
        price: '14.90',
        note: 'Main salad',
      },
    ],
  },
  {
    id: 'savoury',
    title: 'Savoury Crêpes & Galettes',
    hasBase: true,
    items: [
      {
        name: 'Complete',
        description: 'Cheese blend, Iberian honey-roasted ham, organic fried egg.',
        price: '11.40',
        popular: true,
      },
      {
        name: 'Brixton Jerk',
        description:
          'Cheese blend, jerk chicken, red onion, red pepper, biquinho pepper, parsley, spring onion, a dash of Tabasco and spinach.',
        price: '16.70',
      },
      {
        name: 'Provence',
        description: 'Cheese blend, garlic mushrooms, Iberian honey-roasted ham.',
        price: '11.60',
      },
      {
        name: 'Just Cheese',
        description: 'Cheese blend of Cheddar and Emmental with mixed herbs.',
        price: '9.50',
        diet: 'v',
      },
      {
        name: 'Spaniard',
        description: 'Cheese, chorizo, fried egg, red onions, baby leaf spinach.',
        price: '15.60',
        note: 'We love The Spaniard',
      },
      {
        name: 'The Goat',
        description:
          'Goat cheese, baby leaf spinach, black olives, cherry tomatoes and mixed herbs, drizzled with garlic oil.',
        price: '12.40',
        diet: 'v',
      },
      {
        name: 'Juarito',
        description:
          'Courgette, red peppers, red onions, vine tomatoes, biquinho peppers, black beans, plantain and guacamole.',
        price: '15.60',
        diet: 'vg',
        popular: true,
      },
      {
        name: 'King Prawn Cajun',
        description:
          'Cheese blend, king prawns, red peppers and red onions, seasoned with Cajun spices, Tabasco, parsley.',
        price: '16.20',
      },
      {
        name: 'Godfather',
        description: 'Cheese, Italian pepperoni sausage, fried egg and jalapeño peppers.',
        price: '12.60',
      },
      {
        name: 'Salmon Panache',
        description: 'Scottish smoked salmon, fresh asparagus, organic egg, crème fraîche, rocket.',
        price: '15.30',
      },
      {
        name: 'Asparagus Plus',
        description: 'Cheese blend, fresh asparagus, Iberian honey-roasted ham, organic fried egg.',
        price: '15.40',
      },
      {
        name: 'Picante',
        description:
          'Cheese blend, homemade spicy minced beef, red onions, fresh tomatoes, red peppers, jalapeño peppers.',
        price: '15.20',
      },
      {
        name: 'El Egg Ranchero',
        description:
          'Chorizo, egg, white onions, tomato chutney, organic black beans, jalapeños, guacamole, parsley.',
        price: '16.49',
      },
      {
        name: 'Fermiere',
        description: 'Cheddar cheese, sundried tomatoes, baby leaf spinach, garlic mushrooms.',
        price: '13.60',
        diet: 'v',
      },
      {
        name: 'Burrata Crepe',
        description: 'Burrata, fresh tomatoes, Parma ham, rocket and pesto.',
        price: '16.40',
      },
      {
        name: 'Dujhan',
        description:
          'Vegan sausage, chestnut mushrooms, sun-dried tomatoes, fresh asparagus, homemade caramelised onions, rocket and spinach. Drizzled with balsamic & mustard dressing.',
        price: '15.50',
        diet: 'vg',
      },
      {
        name: 'Gorgonzola Silva',
        description: 'Gorgonzola cheese, rocket, homemade caramelised onions, sundried tomatoes.',
        price: '12.60',
        diet: 'v',
      },
      {
        name: 'Full Morning Glory',
        description: 'Cheese blend, fresh tomatoes, crispy bacon, mushroom, organic fried egg.',
        price: '14.90',
      },
      {
        name: 'Gaucho Che',
        description:
          'Steak strips, cheese blend, red onions, courgette, red peppers, biquinho pepper (little beak pepper), organic fried egg.',
        price: '17.20',
      },
      {
        name: 'Caramelised Goat',
        description: 'Grilled goat cheese, homemade caramelised onions, rocket.',
        price: '12.20',
        diet: 'v',
      },
      {
        name: 'Rosa Squash',
        description:
          'Vegan sausage, grilled butternut squash, courgette, red pepper confit, roasted almonds, tomato chutney and rocket.',
        price: '15.30',
        diet: 'vg',
      },
    ],
  },
  {
    id: 'sauces',
    title: 'Homemade Sauces',
    items: [
      { name: 'Signature Chilli Sauce', description: 'Homemade chilli sauce.', price: '1.60' },
      { name: 'Garlic Butter', description: 'Butter, garlic and parsley.', price: '2.20' },
      { name: 'Salad Dressing', description: 'Homemade balsamic and maple dressing.', price: '1.40' },
    ],
  },
  {
    id: 'sweet',
    title: 'Sweet Crêpes & Galettes',
    hasBase: true,
    items: [
      { name: 'Nutella', price: '6.40', popular: true },
      {
        name: 'Nutella Rocks',
        description: 'Nutella, shaved almonds, strawberries and whipped cream.',
        price: '9.90',
        popular: true,
      },
      {
        name: 'Banoffee',
        description: 'Toffee, banana, whipped cream, Belgian chocolate, shaved almonds.',
        price: '10.40',
      },
      { name: 'Belgian Chocolate', description: 'Triple chocolate mix.', price: '5.80' },
      { name: 'Lemon & Sugar', price: '5.90', popular: true },
      {
        name: 'Wild But Strawberry',
        description: 'Fresh strawberries, mixed Belgian chocolate, whipped cream.',
        price: '9.90',
      },
      {
        name: 'Apple d’Amour',
        description: 'Homemade caramelised apple and cinnamon, maple syrup, crème fraîche and pecan nuts.',
        price: '10.40',
      },
      {
        name: 'Sweet Sin',
        description: 'Grilled banana, Belgian chocolate, splash of rum, ice cream.',
        price: '9.40',
      },
      { name: 'Real Canadian Maple Syrup', price: '5.60' },
      {
        name: 'Banana Canela',
        description: 'Grilled banana, honey, double cream, cinnamon.',
        price: '9.40',
      },
      {
        name: 'Coco Loco',
        description: 'Belgian chocolate, coconut, splash of rum, ice cream.',
        price: '9.80',
      },
      {
        name: 'Maple Dream',
        description: 'Grilled banana, real maple syrup, hazelnuts, walnuts, whipped cream, ice cream.',
        price: '9.60',
      },
      { name: 'Caramel', price: '5.80' },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    items: [
      { name: 'Freshly Squeezed Orange Juice', price: '5.20' },
      { name: 'Homemade Lemonade', price: '5.20' },
      { name: 'Guaraná Soda', description: 'Brazilian soda with a fruity flavour.', price: '3.60' },
      { name: 'Dalston Ginger Beer', price: '3.60' },
      { name: 'Coke', price: '3.50' },
      { name: 'Coke Zero', price: '3.50' },
      { name: 'Diet Coke', price: '3.50' },
    ],
  },
  {
    id: 'beer-wine',
    title: 'Beer, Cider & Wine',
    items: [
      { name: 'Pinkus Special Lager', price: '6.20' },
      { name: 'Cidre de Normandie', description: '75cl bottle.', price: '20.50', diet: 'vg' },
      { name: 'Perlage Sora Loc Prosecco', price: '34.00', diet: 'vg' },
      { name: 'Gaia Verdejo Sauvignon Blanc', description: 'Spain, 13%.', price: '31.50' },
      { name: 'Flos de Pinoso Tinto', description: 'Spain, 14%.', price: '28.00' },
    ],
  },
]

export interface Photo {
  src: string
  alt: string
  width: number
  height: number
  credit?: string
}

// Processed by scripts/build-images.mjs into public/photos.
export const photos = {
  shopfront: {
    src: 'shopfront',
    alt: 'Sarava’s teal shopfront on Second Avenue, red SARAVA sign and sun logo, happy hour board in the window, tables out in the arcade under paper lanterns',
    width: 4032,
    height: 3024,
    credit: 'Sarava',
  },
  room: {
    src: 'room',
    alt: 'Inside Sarava: a turquoise wall hung edge to edge with framed pictures above wooden tables and red chairs',
    width: 1500,
    height: 1000,
    credit: 'Loic Salan for Brixton Village',
  },
  hotSauce: {
    src: 'hot-sauce',
    alt: 'Homemade chilli sauce poured over a galette topped with a fried egg and rocket',
    width: 1500,
    height: 1000,
    credit: 'Loic Salan for Brixton Village',
  },
  galette: {
    src: 'galette',
    alt: 'A buckwheat galette with a fried egg, a dot of chilli sauce and rocket on a stack of square white plates',
    width: 1500,
    height: 2250,
    credit: 'Loic Salan for Brixton Village',
  },
  sweet: {
    src: 'sweet',
    alt: 'A sweet crêpe being finished with cream, flaked almonds and coffee beans',
    width: 1500,
    height: 2250,
    credit: 'Brixton Village',
  },
  kitchen: {
    src: 'kitchen',
    alt: 'Making galettes on the hotplates behind the counter, turquoise wall behind',
    width: 1500,
    height: 1000,
    credit: 'Loic Salan for Brixton Village',
  },
  salmon: {
    src: 'salmon',
    alt: 'A folded buckwheat galette with smoked salmon, asparagus, rocket, pesto and a fried egg',
    width: 3568,
    height: 2007,
    credit: 'Sarava via Deliveroo',
  },
} satisfies Record<string, Photo>
