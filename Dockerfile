# Funeral Pictorial — static site served by nginx.
# Coolify (or any Docker host) builds this straight from the repository.
FROM nginx:1.27-alpine

# Replace the default server config with ours (clean URLs, caching, health check)
RUN rm /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/site.conf

# Copy the site
WORKDIR /usr/share/nginx/html
COPY index.html about.html contact.html upload.html 404.html ./
COPY assets ./assets

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
