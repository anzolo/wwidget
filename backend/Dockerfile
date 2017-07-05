FROM node:latest

# # Create app directory
# RUN mkdir -p /srv/backend
# ADD ./backend /srv/backend
WORKDIR /srv/backend

# # Install app dependencies
# COPY package.json /srv/backend/
# RUN npm install

# # Bundle app source
# COPY . /srv/backend

# EXPOSE 9500

CMD [ "npm", "start" ]