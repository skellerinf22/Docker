# Alpine Image als Basis
FROM node:alpine

# Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# ins Containerverzeichnis kopieren
COPY package*.json ./
COPY server.js ./
COPY index.html ./

# Abhängigkeiten installieren
RUN npm install express mysql body-parser

# Port 3000 öfnen
EXPOSE 3000

# Webserver starten, sobald die Datenbank erreichbar ist
CMD ["sh", "-c", "until nc -z database 3306; do sleep 1; done; node server.js"]
