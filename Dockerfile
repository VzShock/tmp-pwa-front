FROM node:20.9

WORKDIR client

COPY . .

RUN ["yarn"]
RUN ["yarn", "build"]

CMD ["yarn", "start"]
