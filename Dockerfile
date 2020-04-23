FROM picoded/ubuntu-openjdk-8-jdk
# use this if deployed in local machine
#FROM picoded/ubuntu-openjdk-8-jdk # use this if deployed in gns3

ENV VIRTUAL_HOST hls.gns3.fr

RUN apt-get update && apt-get install -y --no-install-recommends curl sudo net-tools iputils-ping apt-utils software-properties-common git wget build-essential iproute nano gzip hostname openssl tar telnet lsb-release network-manager

RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt-get update && apt-get install -y nodejs 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN mv ./node_modules/keycloak-connect/middleware/protect.js ./node_modules/keycloak-connect/middleware/protect-backup.js
COPY protect.js ./node_modules/keycloak-connect/middleware/
COPY app2.js ./
COPY public public
COPY keycloak1.json ./
COPY keycloak.json ./
COPY app.js ./
COPY app.sh ./

EXPOSE 3000

CMD ["/bin/bash"]
#CMD [ "sh", "/usr/src/app/app.sh"]

# hls ga punya /etc/init.d/networking

