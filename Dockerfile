# build environment
FROM node:12.2.0-alpine as build
WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
COPY package.json /frontend/package.json
RUN npm install
# RUN npm install @vue/cli@3.7.0 -g
COPY . /frontend
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /frontend/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]