import { paths } from '../routing/paths.js'

/**
 * @typedef {object} InfoPage
 * @property {string} id
 * @property {string} path      One of `paths.*`.
 * @property {string} title
 * @property {string} intro
 * @property {{ heading: string, body: string }[]} sections
 */

/** @type {InfoPage[]} */
export const infoPages = [
  {
    id: 'about',
    path: paths.about,
    title: 'About Fieldhouse',
    intro: 'We make a short list of things and try to make them last.',
    sections: [
      { heading: 'How we work', body: 'Each product is made in small batches by workshops we have visited, and every one can be repaired or resoled.' },
      { heading: 'What we avoid', body: 'We do not run constant sales or introduce new colours every month. If a design is right, we keep making it.' },
    ],
  },
  {
    id: 'contact',
    path: paths.contact,
    title: 'Contact',
    intro: 'Questions about an order or a product? Write to us and a person will reply within one working day.',
    sections: [
      { heading: 'Email', body: 'help@fieldhouse.example' },
      { heading: 'Hours', body: 'Monday to Friday, 9:00 to 17:00.' },
    ],
  },
  {
    id: 'faq',
    path: paths.faq,
    title: 'Frequently asked questions',
    intro: 'The answers most people look for.',
    sections: [
      { heading: 'How long does delivery take?', body: 'Standard delivery takes 3 to 5 working days.' },
      { heading: 'Can I change my order after placing it?', body: 'Yes, within one hour. Contact us and we will update it before it ships.' },
      { heading: 'Do you ship internationally?', body: 'Not yet. We currently deliver within the United States.' },
    ],
  },
  {
    id: 'shipping',
    path: paths.shipping,
    title: 'Shipping',
    intro: 'Free standard shipping on orders over $75.',
    sections: [
      { heading: 'Standard', body: '3 to 5 working days. $6 under $75, free above.' },
      { heading: 'Express', body: '1 to 2 working days. $18.' },
    ],
  },
  {
    id: 'returns',
    path: paths.returns,
    title: 'Returns',
    intro: 'Return anything within 30 days, unused and in its original packaging.',
    sections: [
      { heading: 'How to return', body: 'Contact us with your order number and we will send a prepaid label.' },
      { heading: 'Refunds', body: 'Refunds go back to the original payment method within 5 working days of arrival.' },
    ],
  },
  {
    id: 'privacy',
    path: paths.privacy,
    title: 'Privacy policy',
    intro: 'This is placeholder text. Replace it with the real policy before launch.',
    sections: [{ heading: 'What we collect', body: 'Placeholder: describe the data this storefront collects and why.' }],
  },
  {
    id: 'terms',
    path: paths.terms,
    title: 'Terms of service',
    intro: 'This is placeholder text. Replace it with the real terms before launch.',
    sections: [{ heading: 'Using this site', body: 'Placeholder: describe the terms for using this storefront.' }],
  },
]
