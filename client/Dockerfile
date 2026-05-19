FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL=http://server:5000/api
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json tsconfig.json tsconfig.node.json vite.config.ts tailwind.config.js postcss.config.js .
RUN npm install

COPY src ./src
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
