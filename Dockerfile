FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm install -g serve

EXPOSE 5173

CMD sh -c "if [ \"$NODE_ENV\" = 'production' ]; then \
  npm run build && serve -s dist -l 5173; \
else \
  npm run dev; \
fi"