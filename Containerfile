FROM registry.access.redhat.com/ubi9:latest as builder

WORKDIR /usr/src/app

RUN dnf -y install --setopt=tsflags=nodocs nodejs && dnf clean all

COPY package.json package-lock.json ./
RUN npm install

COPY . .
ENV REACT_APP_QUERY_URL=REACT_APP_QUERY_URL_variable_placeholder
RUN npm run build



FROM registry.access.redhat.com/ubi9:latest

WORKDIR /usr/share/nginx
EXPOSE 80

RUN dnf -y install --setopt=tsflags=nodocs nginx && dnf clean all

COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh entrypoint.sh
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

ENTRYPOINT ./entrypoint.sh
