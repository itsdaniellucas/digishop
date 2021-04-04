FROM node:current-alpine AS base
WORKDIR /base
COPY package*.json ./
COPY next.config.js ./
RUN npm install
COPY . .

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

FROM node:current-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
COPY --from=build /build/next.config.js ./
RUN npm install next

EXPOSE 13001
CMD npm run start