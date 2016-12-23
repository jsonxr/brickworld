FROM nginx:1.10

RUN \
    apt-get update && \
    apt-get install -y build-essential curl git && \
    ## Install nodejs packages
    curl -sL https://deb.nodesource.com/setup_7.x | bash - && \
    ## Install yarn packages
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    apt-get install -y yarn

RUN npm install -g github:gulpjs/gulp#4.0

ADD package.json yarn.lock /usr/src/app/
RUN cd /usr/src/app && yarn

ADD gulpfile.js /usr/src/app
ADD src /usr/src/app/src

RUN cd /usr/src/app && gulp build
RUN \
    rm -rf /usr/share/nginx/html && \
    ln -s /usr/src/app/dist/client /usr/share/nginx/html && \
    ln -s /usr/src/app/dist/shared /usr/share/nginx/html/shared

# ADD ./dist/client /usr/share/nginx/html
# ADD ./dist/shared /usr/share/nginx/html/shared
