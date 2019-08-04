FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
COPY server/nginx.conf /etc/nginx/conf.d
COPY server/proxy_params /etc/nginx
COPY static/ /var/www-data