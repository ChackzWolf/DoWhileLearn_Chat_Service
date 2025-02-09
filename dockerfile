FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY src/Protos ./src/Protos
RUN npm install
RUN npx tsc

FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=3009
ENV CHAT_GRPC_PORT=5009
COPY package*.json ./
RUN npm install
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/Protos ./dist/Protos
USER node
EXPOSE ${PORT} ${CHAT_GRPC_PORT}
CMD ["node", "dist/server.js"]