FROM node:19 as build

# Create app directory
WORKDIR /usr/src/app

ARG VITE_IDP_PROTOCOL
ARG VITE_IDP_HOST
ARG VITE_IDP_PORT
ARG VITE_SP_PROTOCOL
ARG VITE_SP_HOST
ARG VITE_SP_PORT
ARG VITE_API_PROTOCOL
ARG VITE_API_HOST
ARG VITE_API_PORT

ENV VITE_IDP_PROTOCOL ${VITE_IDP_PROTOCOL}
ENV VITE_IDP_HOST ${VITE_IDP_HOST}
ENV VITE_IDP_PORT ${VITE_IDP_PORT}
ENV VITE_SP_PROTOCOL ${VITE_SP_PROTOCOL}
ENV VITE_SP_HOST ${VITE_SP_HOST}
ENV VITE_SP_PORT ${VITE_SP_PORT}
ENV VITE_API_PROTOCOL ${VITE_API_PROTOCOL}
ENV VITE_API_HOST ${VITE_API_HOST}
ENV VITE_API_PORT ${VITE_API_PORT}

# Install app dependencies
COPY package*.json .
COPY yarn.lock .

RUN yarn install

# Bundle app source
COPY public/ ./public
COPY src/ ./src/
COPY index.html .
COPY vite.config.js .
# COPY .env .
RUN yarn build

# EXPOSE 3300
# CMD [ "yarn", "start" ]

FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
