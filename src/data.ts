import luxemart from './photos/luxemart.png'
import golden from './photos/golden.png'
import linkyra from './photos/linkyra.png'
import zodex from './photos/zodex.jpg'
import payflow from './photos/payflow.jpg'
import movieapp from './photos/movieapp.jpg'
import recibe from './photos/recibe.jpg'
import yummy from './photos/yummy.jpg'
import weather from './photos/weather.jpg'
import notes from './photos/notes.jpg'
import login from './photos/login.jpg'
import bookmarks from './photos/bookmarks.jpg'
import quotes from './photos/quotes.jpg'
import meCafe from './photos/me-cafe.jpg'
import meSuit from './photos/me-suit.jpg'
import meJacket from './photos/me-jacket.jpg'
import meCert from './photos/me-certificate.jpg'
import cv from './cv/Ahmed-Osama-Frontend-CV.pdf'

export type Project = {
  id: string
  index: string
  title: string
  kind: string
  blurb: string
  points: string[]
  stack: string[]
  live: string
  code: string
  shot: string
  accent: string
}

export const projects: Project[] = [
  {
    id: 'luxemart',
    index: '01',
    title: 'LuxeMart',
    kind: 'E-commerce storefront',
    blurb:
      'A full storefront: auth, products, brands and categories, cart, wishlist, checkout, orders, reviews and profile.',
    points: [
      'Filters (keyword, price, category, brand) synced with the URL, with debounced search',
      'Cart and wishlist in Redux Toolkit, server data in TanStack Query',
      'Forms validated with React Hook Form and Zod, dark and light mode',
    ],
    stack: ['Next.js', 'TypeScript', 'Redux Toolkit', 'TanStack Query', 'Framer Motion'],
    live: 'https://fresh-cart-five-snowy.vercel.app',
    code: 'https://github.com/ahmedosama0038/FreshCart',
    shot: luxemart,
    accent: '#34d399',
  },
  {
    id: 'golden-plate',
    index: '02',
    title: 'The Golden Plate',
    kind: 'Restaurant ordering and admin',
    blurb:
      'Frontend for a restaurant app: menu, cart, order tracking and table reservations, connected to a Laravel API built by a teammate.',
    points: [
      'Admin screens for products and extras, with route protection',
      'Extras (add-ons) from admin management to customer selection in orders',
      'Image compression before upload',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'REST APIs'],
    live: 'https://the-golden-plate.vercel.app',
    code: 'https://github.com/ahmedosama0038/The-Golden-Plate',
    shot: golden,
    accent: '#f5c451',
  },
  {
    id: 'social-connect',
    index: '03',
    title: 'Social Connect',
    kind: 'Social media app (LinKyra)',
    blurb:
      'A social feed with posts, likes, comments, bookmarks, notifications and profiles, consuming a third-party REST API.',
    points: [
      'Login and registration with React Hook Form and Zod',
      'Token-based requests through an Axios instance, protected routes',
      'Auth and theme in Context, mutations with TanStack Query',
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'HeroUI', 'TanStack Query'],
    live: 'https://lin-kyra.vercel.app',
    code: 'https://github.com/ahmedosama0038/LinKyra',
    shot: linkyra,
    accent: '#a78bfa',
  },
  {
    id: 'zodex',
    index: '04',
    title: 'Zodex School',
    kind: 'School platform, Arabic and English',
    blurb:
      'A school platform that connects students, parents, teachers and administrators: academics, progress tracking and a supplies store.',
    points: [
      'Arabic and English versions of the site',
      'Separate portals for students, parents, teachers and administrators',
      'Forms validated with React Hook Form and Zod, data with TanStack Query',
    ],
    stack: ['Next.js', 'TypeScript', 'TanStack Query', 'React Hook Form', 'Zod', 'Framer Motion'],
    live: 'https://zodex-school.vercel.app',
    code: 'https://github.com/ahmedosama0038/zodex-school',
    shot: zodex,
    accent: '#38bdf8',
  },
  {
    id: 'payflow',
    index: '05',
    title: 'PayFlow',
    kind: 'Mock payment checkout and dashboard',
    blurb:
      'A demo payment checkout and transactions dashboard. No real cards or money are involved.',
    points: [
      'Create a payment, then open a dynamic checkout page with loading, error and not-found states',
      'Card form validated with Zod, server-side check of the amount, mock payment route',
      'Transactions dashboard with search, status filter and pagination, plus a Jest unit test',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'React Hook Form', 'Zod', 'Jest'],
    live: 'https://payflow-eight-alpha.vercel.app',
    code: 'https://github.com/ahmedosama0038/payflow',
    shot: payflow,
    accent: '#818cf8',
  },
]

export const stack = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Redux Toolkit', 'TanStack Query',
  'React Hook Form', 'Zod', 'Tailwind CSS', 'HeroUI', 'Radix UI', 'Framer Motion',
  'Axios', 'Vite', 'Git', 'Vercel', 'Postman',
]

export const contact = {
  email: 'ah.osama303@gmail.com',
  phone: '+20 102 124 5010',
  github: 'https://github.com/ahmedosama0038',
  linkedin: 'https://www.linkedin.com/in/ahmed-osama',
  whatsapp: 'https://wa.me/201021245010',
  instagram: 'https://www.instagram.com/__a7med__72',
  cv,
}

export const stackGroups: { label: string; items: string[] }[] = [
  { label: 'Core', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vite'] },
  { label: 'State and data', items: ['Redux Toolkit', 'TanStack Query', 'Axios'] },
  { label: 'Forms', items: ['React Hook Form', 'Zod'] },
  { label: 'UI and motion', items: ['Tailwind CSS', 'HeroUI', 'Radix UI', 'Framer Motion'] },
  { label: 'Workflow', items: ['Git', 'Vercel', 'Postman'] },
]

/** Feature index, taken from the CV project bullets. */
export const features: { p: number; text: string }[] = [
  { p: 0, text: 'Authentication' }, { p: 0, text: 'Products, brands and categories' }, { p: 0, text: 'Filters synced with the URL' },
  { p: 0, text: 'Debounced search' }, { p: 0, text: 'Cart and wishlist in Redux Toolkit' }, { p: 0, text: 'Checkout and orders' },
  { p: 0, text: 'Reviews and user profile' }, { p: 0, text: 'Dark and light mode' },
  { p: 1, text: 'Menu browsing and cart' }, { p: 1, text: 'Order tracking' }, { p: 1, text: 'Table reservations' },
  { p: 1, text: 'Admin screens for products and extras' }, { p: 1, text: 'Route protection' }, { p: 1, text: 'Image compression before upload' },
  { p: 1, text: 'Extras from admin to customer order' },
  { p: 3, text: 'Arabic and English versions' }, { p: 3, text: 'Student, parent, teacher and admin portals' }, { p: 3, text: 'Supplies store' },
  { p: 4, text: 'Dynamic checkout links' }, { p: 4, text: 'Card form validated with Zod' }, { p: 4, text: 'Transactions dashboard with filters' },
  { p: 4, text: 'Search and pagination' }, { p: 4, text: 'Jest unit test' },
  { p: 2, text: 'Create and edit posts' }, { p: 2, text: 'Likes, comments and bookmarks' }, { p: 2, text: 'Notifications and profiles' },
  { p: 2, text: 'Login and registration, validated with Zod' }, { p: 2, text: 'Token-based requests through Axios' }, { p: 2, text: 'Protected routes' },
]

export const photos: { src: string; alt: string; tag: string; note: string }[] = [
  { src: meCafe, alt: 'Ahmed Osama seated at a table', tag: 'Ahmed', note: 'Cairo, Egypt' },
  { src: meCert, alt: 'Ahmed Osama holding a certificate of completion', tag: 'Certificate of Completion', note: 'Tap to see it full size' },
  { src: meSuit, alt: 'Ahmed Osama in a dark jacket', tag: 'Ahmed Osama Fathy', note: 'Frontend Developer' },
  { src: meJacket, alt: 'Ahmed Osama standing in a covered walkway', tag: 'Ahmed', note: 'Always learning' },
]

export const values = [
  ['Clean Code', "Every line must be readable. Code is read more than it's written."],
  ['Attention to Detail', 'The magic happens in the smallest pixels and animations.'],
  ['Always Learning', "Technology evolves, and I'm always first in line to level up."],
] as const

export type Repo = {
  title: string
  repo: string
  kind: string
  blurb: string
  stack: string[]
  code: string
  live?: string
  shot?: string
  featured?: number
}
const gh = (r: string) => `https://github.com/ahmedosama0038/${r}`

/** Every public repository that is a project, strongest first. Descriptions come from READMEs, the code and the live pages. */
export const repos: Repo[] = [
  ...projects.map((p, i) => ({
    title: p.title, repo: p.code.split('/').pop() as string, kind: p.kind, blurb: p.blurb, stack: p.stack,
    code: p.code, live: p.live, shot: p.shot, featured: i + 1,
  })),
  { title: 'Movie App', repo: 'movie-app', kind: 'Movie discovery', blurb: 'Movie discovery app powered by the TMDB API, with an auth flow.', stack: ['React', 'Bootstrap', 'Formik'], code: gh('movie-app'), live: 'https://movie-app-5if8.vercel.app', shot: movieapp },
  { title: 'Recibe', repo: 'Recibe', kind: 'Recipe browser', blurb: 'Recipe browser with categories, meal cards and a meal details page, data from an API.', stack: ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Axios'], code: gh('Recibe'), live: 'https://recibe-phi.vercel.app', shot: recibe },
  { title: 'Yummy', repo: 'YUMMY', kind: 'Recipe app', blurb: 'Vanilla JS recipe app with dynamic search and ingredient details.', stack: ['JavaScript', 'Bootstrap', 'API'], code: gh('YUMMY'), live: 'https://ahmedosama0038.github.io/YUMMY/', shot: yummy },
  { title: 'Start Framework', repo: 'START-FRAMEWORK', kind: 'React starter', blurb: 'A React and Vite starter set up with React Bootstrap, MUI and React Router. Code only, no live demo.', stack: ['React', 'Vite', 'React Bootstrap', 'MUI', 'React Router'], code: gh('START-FRAMEWORK') },
  { title: 'Weather', repo: 'WEATHER-APPP', kind: 'Weather page', blurb: 'A weather page built with HTML, CSS, Bootstrap and JavaScript.', stack: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'], code: gh('WEATHER-APPP'), live: 'https://ahmedosama0038.github.io/WEATHER-APPP/', shot: weather },
  { title: 'Notes', repo: 'NOTES-API', kind: 'Notes app front end', blurb: 'Notes app front end in plain JavaScript and Bootstrap. It opens on register and login screens.', stack: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'], code: gh('NOTES-API'), live: 'https://ahmedosama0038.github.io/NOTES-API/', shot: notes },
  { title: 'Smart Login', repo: '-Smart-Login', kind: 'Login system', blurb: 'Login and sign-up screens in plain JavaScript, with required-field validation.', stack: ['HTML', 'CSS', 'JavaScript'], code: gh('-Smart-Login'), live: 'https://ahmedosama0038.github.io/-Smart-Login/', shot: login },
  { title: 'Bookmarks', repo: '-Bookmarks', kind: 'Bookmark manager', blurb: 'Save a site name and URL with validation, then visit or delete the bookmark.', stack: ['HTML', 'CSS', 'JavaScript'], code: gh('-Bookmarks'), live: 'https://ahmedosama0038.github.io/-Bookmarks/', shot: bookmarks },
  { title: 'Quote of the Day', repo: 'FIRST-JS-QUOTES', kind: 'First JavaScript project', blurb: 'A button that shows a random quote.', stack: ['HTML', 'CSS', 'JavaScript'], code: gh('FIRST-JS-QUOTES'), live: 'https://ahmedosama0038.github.io/FIRST-JS-QUOTES/', shot: quotes },
  { title: 'Portfolio v1', repo: 'Portfolio', kind: 'Previous portfolio', blurb: 'The previous version of this portfolio, built with Next.js and TypeScript.', stack: ['Next.js', 'TypeScript', 'Framer Motion'], code: gh('Portfolio') },
]

/** Live demos that open on a sign-in page (checked by loading them); no demo account is published. */
export const signInRequired = ['https://movie-app-5if8.vercel.app', 'https://lin-kyra.vercel.app']
