# Funeral Pictorial — website

Static marketing site for **Funeral Pictorial**, a memorial-slideshow service that turns
client-supplied photos and videos into a tribute for the funeral service and sets up a TV
at the venue when required.

## Structure

```
index.html              Home page (hero, how it works, sample TV slideshow, packages, FAQ)
about.html              About page  → linked and served as /about
contact.html            Contact page → linked and served as /contact
assets/
  css/styles.css        All styling (palette lives in :root at the top)
  js/main.js            Mobile nav, sample slideshow, contact-form fallback, footer year
  images/               Logo, favicon and all SVG artwork
.htaccess / netlify.toml / vercel.json   Clean-URL config for Apache, Netlify and Vercel
```

All three pages sit in the main directory. Links point to `about` and `contact` with no
extension, and the host serves the matching `.html` file:

- **GitHub Pages** does this automatically.
- **Apache** hosts (most cPanel shared hosting) use the included `.htaccess`.
- **Netlify** uses `netlify.toml` (Pretty URLs) and **Vercel** uses `vercel.json` (cleanUrls).
- **nginx**: add `try_files $uri $uri.html $uri/ =404;` to the `location /` block.

Because the links have no extension, the About and Contact links only resolve when the
site is served by a web server. To preview from disk, open `about.html` and `contact.html`
directly, or run a quick local server from the folder:

```bash
python3 -m http.server 8000
```

(the `.htaccess` rules are not applied by that test server, so use `about.html` there).

## Before going live

1. **Contact form** — in `contact.html`, replace `YOUR_FORM_ID` in the form's `action`
   with your Formspree (or similar) endpoint. Until then the form shows the thank-you panel
   locally without sending anything.
2. **Phone, email, service area** — search for `(312) 555-0147`, `+13125550147`,
   `hello@funeralpictorial.com` and `Chicagoland` across the three pages and replace.
3. **Pricing** — the two package prices ($299 and $499) were set by the owner;
   change them in the Packages section of `index.html` and the package dropdown in
   `contact.html`.
4. **Photos** — the artwork is original SVG so the site has no licensing concerns. Swap in real
   photography by dropping files into `assets/images/` and updating the `<img>` tags
   (about-story, and the ten `slide-*.svg` sample slides that rotate in the hero TV).
5. **Logo** — `assets/images/logo-mark.svg` (circle mark used in the header/footer) and
   `assets/images/logo.svg` (full lockup with wordmark) were rebuilt as vectors from the
   supplied logo. Replace them with your master files if you have them.
