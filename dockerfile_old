FROM node:16-alpine3.12 

RUN apk --no-cache add git

RUN git clone --depth 1 https://github.com/jokob-sk/mount-bookmark.git /opt/mount-bookmark
WORKDIR /opt/mount-bookmark

RUN npm install 
CMD "npm" "start"

EXPOSE 80
