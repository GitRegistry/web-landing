FROM nginx:alpine

LABEL group="paluv" name="pilotary"

COPY docker/default.conf.template /etc/nginx/templates/default.conf.template

COPY index.html /usr/share/nginx/html/
COPY en /usr/share/nginx/html/en
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets
