FROM node:lts
# WORKDIR /app

# COPY package.json ./app/package.json
# RUN rm -rf /app/node_modules/
# RUN yarn
# RUN npm install -g @angular/cli@9.0.1

# COPY . /app
# EXPOSE 4200
# # CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "1", "--disableHostCheck"]
# set working directory
WORKDIR /app
# copy and install app dependencies
COPY package.json /app/package.json
RUN yarn install
RUN npm install -g @angular/cli@9.0.1
# add app
COPY . /app
EXPOSE 4200
# start app
CMD ["ng",  "serve", "--host", "0.0.0.0"]
