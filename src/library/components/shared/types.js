/**
 * Shapes shared by the homepage sections and footers.
 *
 * @typedef {object} Action        A call to action. Becomes a link when `href` is set, otherwise a button.
 * @property {string} label
 * @property {string} [href]
 * @property {(event: React.MouseEvent) => void} [onClick]
 * @property {React.ReactNode} [icon]   Trailing icon.
 * @property {string} [id]
 *
 * @typedef {object} ImageSource
 * @property {string} src
 * @property {string} [alt='']     Empty = decorative.
 *
 * @typedef {object} NewsletterConfig   Everything NewsletterForm accepts, plus copy for the block around it.
 * @property {string} [title]
 * @property {string} [description]
 * @property {(values: { email: string, consent?: boolean }, event) => void | Promise<void>} [onSubscribe]
 */

export {}
