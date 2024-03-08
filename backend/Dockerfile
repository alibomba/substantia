FROM node:20 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL=""

RUN npx prisma migrate dev

RUN npm run db:seed

RUN npm test

RUN npm run build

RUN mkdir -p /app/build/public

COPY public/* /app/build/public/

FROM node:20

WORKDIR /app

COPY --from=builder /app /app

ENV PORT=
ENV DATABASE_URL=""
ENV FRONTEND_URL=""
ENV JWT_SECRET=""
ENV JWT_REFRESH_SECRET=""
ENV JWT_TTL=""
ENV PASSWORD_RESET_JWT_SECRET=""
ENV GOOGLE_CLIENT_ID=""
ENV GOOGLE_SMTP_USER=""
ENV GOOGLE_SMTP_PASSWORD=""
ENV AZURE_ACCOUNT_NAME=""
ENV AZURE_ACCOUNT_KEY=""
ENV AZURE_CONTAINER_NAME=""
ENV STRIPE_SECRET_KEY=""

EXPOSE 8000

CMD [ "npm", "start" ]