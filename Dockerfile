# The tracker as a small local web server with its own SQLite database.
# Data lives in /data — docker-compose.yml maps it to ./data next to this file.
FROM node:24-alpine
RUN apk add --no-cache tzdata
WORKDIR /app
COPY package.json index.html maturita-matematika-tracker.html ./
COPY css css
COPY js js
COPY vendor vendor
COPY server server
ENV HOST=0.0.0.0 PORT=8080 DATA_DIR=/data
VOLUME /data
EXPOSE 8080
CMD ["node", "--disable-warning=ExperimentalWarning", "server/main.js"]
