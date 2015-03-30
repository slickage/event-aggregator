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

# get set up to run aggregator
RUN npm install

# set up scheduling
# from http://www.ekito.fr/people/run-a-cron-job-with-docker/
# Add crontab file in the cron directory
ADD crontab /etc/cron.d/event-aggregator-cron
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/event-aggregator-cron
 
# Create the log file to be able to run tail
RUN touch /var/log/cron.log
 
# Run the command on container startup
CMD cron && tail -f /var/log/cron.log



