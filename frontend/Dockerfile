FROM node:20 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_BACKEND_URL=""
ENV VITE_GOOGLE_CLIENT_ID=""

RUN npm test

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]