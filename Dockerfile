FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build with environment variables
ARG VITE_EXCHANGE_RATES_API_KEY
ARG VITE_EXCHANGE_RATES_API_URL
ARG NODE_ENV=production

ENV VITE_EXCHANGE_RATES_API_KEY=$VITE_EXCHANGE_RATES_API_KEY
ENV VITE_EXCHANGE_RATES_API_URL=$VITE_EXCHANGE_RATES_API_URL
ENV NODE_ENV=$NODE_ENV

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]