# for single-container testing, run:
# docker build -t event-agg .
# docker run -i -t --net=host event-agg

FROM ubuntu:latest
MAINTAINER Trevor Alexander <talex@privatdemail.net>

# set up node, npm
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y nodejs build-essential

# copy in necessary files
# TODO simplify deployment fs tree to reduce commands
RUN mkdir /var/event-aggregator
WORKDIR /var/event-aggregator/
ADD config.json ./
ADD package.json ./
ADD event-aggregator.js ./
ADD eventbrite-aggregator.js ./
ADD eventprovidermodules.js ./
ADD meetup-aggregator.js ./
ADD hashtoget.js ./
ADD scrape-all.js ./

# install dependencies
RUN npm install

# run and log final callback output
CMD ./node_modules/forever/bin/forever scrape-all.js > /var/log/event-aggregator.log



