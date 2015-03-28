# sudo docker run -d -p 127.0.0.1:5000:5000

FROM centos:centos7
MAINTAINER Trevor Alexander <talex@privatdemail.net>

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all

# set up node, npm
RUN yum install -y nodejs npm

# copy in necessary files
# TODO simplify deployment fs tree to reduce commands
RUN mkdir /var/event-aggregator
WORKDIR /var/event-aggregator/
ADD config.json ./
ADD package.json ./
ADD event-aggregator.js ./
ADD eventbrite-aggregator.js ./
ADD meetup-aggregator.js ./
ADD hashtoget.js ./

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



