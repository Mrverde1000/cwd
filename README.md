# Funeral Pictorial — website

Static marketing site for **Funeral Pictorial**, a memorial-slideshow service that turns
client-supplied photos and videos into a tribute for the funeral service and sets up a TV
at the venue when required.

## Structure

```
index.html              Home page (hero, how it works, sample TV slideshow, packages, FAQ)
about.html              About page  → linked and served as /about
contact.html            Contact page → linked and served as /contact
upload.html             Family upload portal → /upload (Uppy uploader, needs a tus server)
assets/
  css/styles.css        All styling (palette lives in :root at the top)
  js/main.js            Mobile nav, sample slideshow, contact-form fallback, footer year
  js/upload.js          Upload portal: Uppy dashboard + tus resumable uploads
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

## Upload portal

`upload.html` is a working front end for a family upload portal, built on
[Uppy](https://github.com/transloadit/uppy) (MIT licence) with resumable uploads over the
[tus](https://tus.io) protocol. Out of the box it runs in **demo mode**: families can pick
files and see them listed, but nothing is sent.

To make it live you need a tus server to receive the files:

1. Run [tusd](https://github.com/tus/tusd) (official open-source tus server, single binary or
   Docker) on a small VPS, storing files on local disk or in S3-compatible storage such as
   AWS S3, Backblaze B2 or Cloudflare R2.
2. Put it behind HTTPS at a subdomain, e.g. `https://uploads.funeralpictorial.com/files/`,
   and allow CORS from your site's domain.
3. Set `UPLOAD_ENDPOINT` at the top of `assets/js/upload.js` to that URL.
4. Use tusd's hooks (`post-finish`) to email yourself when a family's upload completes.
   The form fields on the page (loved one's name, reference, uploader's name and email,
   notes) are sent as metadata with every file, so each upload is tagged to a tribute.

Alternatives that need no custom server: a Nextcloud "File Drop" link, Pingvin Share's
reverse-share links, or a Dropbox File Request. See the notes in the project chat.

## Deploying with Coolify (Docker)

The repo includes a `Dockerfile` that serves the site with nginx, keeping the clean
`/about`, `/contact` and `/upload` addresses (`deploy/nginx.conf`), plus a health check at
`/healthz`.

1. In Coolify: **New Project → New Resource → Public/Private Repository**, pick this repo
   and branch, Build Pack **Dockerfile**, port **80**.
2. Set the domain (e.g. `https://funeralpictorial.com`). Coolify's proxy issues the TLS
   certificate automatically once DNS points at the server.
3. For the upload server: **New Resource → Docker Compose**, paste
   `deploy/tusd.docker-compose.yml`, give it `https://uploads.funeralpictorial.com`, then
   set `UPLOAD_ENDPOINT` in `assets/js/upload.js` to `https://uploads.funeralpictorial.com/files/`
   and update the `-cors-allow-origin` flag to your site's domain.

To test the container locally: `docker build -t fp-site . && docker run -p 8080:80 fp-site`,
then open http://localhost:8080/about.
