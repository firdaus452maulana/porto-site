FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm install -g vite
RUN npm install -g serve

EXPOSE 4502

CMD sh -c "if [ \"$NODE_ENV\" = 'production' ]; then \
  npm run build && serve -s dist -l 4502; \
else \
  npm run dev; \
fi"