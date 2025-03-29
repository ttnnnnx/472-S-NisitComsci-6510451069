FROM oven/bun:1.2.3
COPY . /app
WORKDIR /app

RUN bunx prisma db pull
RUN bunx prisma db push

RUN bunx prisma generate

EXPOSE 3000

