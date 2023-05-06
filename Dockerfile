FROM node:18-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development

COPY . .

RUN npm i

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "start"]
