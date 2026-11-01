# Funeral Pictorial — website

Static marketing site for **Funeral Pictorial**, a memorial-slideshow service that turns
client-supplied photos and videos into a tribute for the funeral service and sets up a TV
at the venue when required.

## Structure

```
index.html              Home page (hero, how it works, sample TV slideshow, packages, FAQ)
about/index.html        About page  → served at /about/
contact/index.html      Contact page → served at /contact/
assets/
  css/styles.css        All styling (palette lives in :root at the top)
  js/main.js            Mobile nav, sample slideshow, contact-form fallback, footer year
  images/               Logo, favicon and all SVG artwork
.htaccess / netlify.toml / vercel.json   Clean-URL config for Apache, Netlify and Vercel
```

Pages are folders with an `index.html` inside, so URLs are `/`, `/about/` and `/contact/`
and `.html` never appears in the address bar on any host (GitHub Pages, Netlify, Vercel,
Apache, nginx). The site also opens straight from disk by double-clicking `index.html`.

## Before going live

1. **Contact form** — in `contact/index.html`, replace `YOUR_FORM_ID` in the form's `action`
   with your Formspree (or similar) endpoint. Until then the form shows the thank-you panel
   locally without sending anything.
2. **Phone, email, service area** — search for `(312) 555-0147`, `+13125550147`,
   `hello@funeralpictorial.com` and `Chicagoland` across the three pages and replace.
3. **Pricing** — package names and prices are in the Packages section of `index.html`
   and the package dropdown in `contact/index.html`.
4. **Photos** — the artwork is original SVG so the site has no licensing concerns. Swap in real
   photography by dropping files into `assets/images/` and updating the `<img>` tags
   (hero, about-story, and the four `slide-*.svg` sample slides in the TV mock-up).
5. **Logo** — `assets/images/logo-mark.svg` (circle mark used in the header/footer) and
   `assets/images/logo.svg` (full lockup with wordmark) were rebuilt as vectors from the
   supplied logo. Replace them with your master files if you have them.
