FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY server ./server
COPY web ./web
ENV PORT=48777 HOST=0.0.0.0
EXPOSE 48777
USER node
CMD ["node","server/start.cjs"]
