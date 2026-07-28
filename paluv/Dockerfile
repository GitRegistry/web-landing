FROM nginx:alpine

LABEL group="paluv" name="paluv"

COPY docker/default.conf.template /etc/nginx/templates/default.conf.template

COPY index.html /usr/share/nginx/html/
COPY en /usr/share/nginx/html/en
COPY de /usr/share/nginx/html/de
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets
COPY robots.txt sitemap.xml /usr/share/nginx/html/
