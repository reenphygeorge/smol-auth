FROM node:18-alpine

WORKDIR /app

RUN npm install pnpm -g

COPY package.json pnpm-lock.yaml ./
COPY ./ ./

RUN pnpm install -r

EXPOSE 8000

CMD ["pnpm", "dev"]