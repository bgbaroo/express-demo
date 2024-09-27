FROM node:20

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/express-demo?schema=public"
ENV AUTH_SECRET="authsecret"

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
  pnpm install

COPY . .

RUN pnpm prisma && \
  pnpm build 

CMD ["pnpm", "start"]

EXPOSE 8000