FROM node:alpine as stage1
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .
RUN npm run build


FROM nginx:latest as stage2

COPY ./nginx.conf /etc/nginx/nginx.conf
# COPY ./default.conf /etc/nginx/conf.d/default.conf
# COPY ./mime.types /etc/nginx/mime.types

COPY --from=stage1 /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
