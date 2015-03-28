FROM centos:centos7
MAINTAINER Trevor Alexander <talex@privatdemail.net>

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all

# set up node, npm
RUN yum install -y nodejs npm

# copy in necessary files
# TODO simplify deployment fs tree to reduce commands
RUN mkdir /var/event-aggregator
ADD config.json /var/event-aggregator/
ADD package.json /var/event-aggregator/
ADD event-aggregator.js /var/event-aggregator/
ADD eventbrite-aggregator.js /var/event-aggregator/
ADD meetup-aggregator.js /var/event-aggregator/
ADD hashtoget.js /var/event-aggregator/

# get set up to query
WORKDIR /var/event-aggregator/
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



