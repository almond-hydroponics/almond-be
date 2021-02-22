FROM nginx:1.19.0-alpine

RUN \
  rm -rf /etc/nginx/mime.types && \
  rm -rf /etc/nginx/sites-* && \
  rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY gzip.conf /etc/nginx
COPY mime.types /etc/nginx
# Expose ports
EXPOSE 80
EXPOSE 443
