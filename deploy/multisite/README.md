# Multi-site hosting (cPanel-style folders) on Coolify

One Caddy container serves every domain from its own folder under `/data/sites/`, and a
FileBrowser container gives you a browser-based file manager over the same folders.

## Deploy

1. On the server, create the folders once:
   ```bash
   mkdir -p /data/sites /data/filebrowser
   ```
2. Coolify → your project → **New Resource → Docker Compose**. Paste `docker-compose.yml`
   from this folder (the Caddyfile is embedded in it, nothing else to copy).
3. In the resource, each service gets a **Domains** field:
   - **caddy**: every website you host, comma separated, e.g.
     `https://site.157.173.212.187.sslip.io,https://funeralpictorial.com`
   - **filebrowser**: one address for the file manager, e.g. `https://files.157.173.212.187.sslip.io`
4. **Deploy**.

## First login to the file manager

FileBrowser creates an `admin` user on first start and prints a random password in its log.
Read it with:
```bash
docker logs $(docker ps -qf name=filebrowser) 2>&1 | grep -i password
```
Log in at your files address, open **Settings → User Management**, and change the password
immediately.

## Adding a website

1. In FileBrowser, create a folder named exactly like the domain, e.g. `funeralpictorial.com`
   (no `www.`; Caddy redirects `www` to the bare domain automatically).
2. Upload the site's files into it. `index.html` is the home page. Clean URLs work: a file
   `about.html` is served at `/about`.
3. In Coolify, open the compose resource, add `https://funeralpictorial.com` to the **caddy**
   service's domains, save and redeploy. Coolify fetches the certificate.
4. Point the domain's DNS `A` record (and `www`) at the server IP.

## Putting the Funeral Pictorial site in its folder

From the server, pull the files straight from GitHub:
```bash
git clone --depth 1 -b claude/happy-dijkstra-ratvly https://github.com/Mrverde1000/cwd /tmp/fp \
  && mkdir -p /data/sites/site.157.173.212.187.sslip.io \
  && rsync -a --delete /tmp/fp/index.html /tmp/fp/about.html /tmp/fp/contact.html /tmp/fp/upload.html /tmp/fp/404.html /tmp/fp/assets /data/sites/site.157.173.212.187.sslip.io/ \
  && rm -rf /tmp/fp
```
Rename the folder to the real domain when you have one.

## Client logins

In FileBrowser **Settings → User Management → New User**, set the user's **Scope** to the
client's folder (e.g. `/funeralpictorial.com`). They then see and edit only their own site.

## Backups

Everything that matters is in `/data/sites` and `/data/filebrowser`. Back those two folders up
(Hostinger snapshots, or `tar` them to object storage on a schedule).
