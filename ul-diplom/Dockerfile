FROM nginx:alpine

LABEL group="paluv" name="ul-diplom"

COPY docker/default.conf.template /etc/nginx/templates/default.conf.template

COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
