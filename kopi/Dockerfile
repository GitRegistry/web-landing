FROM nginx:alpine

LABEL group="paluv" name="kopi"

COPY docker/default.conf.template /etc/nginx/templates/default.conf.template

# Serve the static site from the default nginx web root.
COPY CNAME favicon.ico index.html script.js styles.css /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY en /usr/share/nginx/html/en
COPY de /usr/share/nginx/html/de
