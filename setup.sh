#!/usr/bin/env bash

# Store vagrant shared directory for reference
SHARED_DIRECTORY=/home/vagrant

# Store project directories for reference
BACKEND_PROJECT_DIRECTORY=$SHARED_DIRECTORY/workflow/api
FRONTEND_PROJECT_DIRECTORY=$SHARED_DIRECTORY/workflow/spa


#   'INSTALING BACKEND DEPENDECES'
echo 'Resynchronizing package indexes'
sudo apt-get -y update

echo 'Installing Git version control system'
sudo apt-get install -y git 

echo 'Installing python development packages'
sudo apt-get install -y python-setuptools python-dev libpq-dev

echo 'Installing PostgreSQL database (PostgreSQL 9.3.15)'
sudo apt-get install -y postgresql postgresql-contrib 


echo 'Creating vagrant database'
sudo -u postgres psql -c 'CREATE DATABASE vagrantdb;'

echo 'Creating vagrant PostgreSQL user'
sudo -u postgres psql -c "CREATE USER vagrant WITH PASSWORD 'vagrant'"

echo 'Setting default configuration'
sudo -u postgres psql -c "ALTER ROLE vagrant SET client_encoding TO 'utf8'"
sudo -u postgres psql -c "ALTER ROLE vagrant SET default_transaction_isolation TO 'read committed'"
sudo -u postgres psql -c "ALTER ROLE vagrant SET timezone TO 'UTC'"

echo 'Giving our database user access rights'
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vagrantDB TO vagrant;"

echo 'Installing Pillow (images processing library) dependencies'
sudo apt-get install -y libtiff5-dev libjpeg8-dev zlib1g-dev libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python-tk

echo 'Install pip python3'
sudo apt-get install -y python3-pip

echo 'Installing project dependencies (requirements file)'
sudo pip3 install -r $BACKEND_PROJECT_DIRECTORY/_requirements/development.txt 

echo 'Running project migration files'
python $BACKEND_PROJECT_DIRECTORY/manage.py migrate


#  'NSTALLING FRONTEND DEPENDECES'
echo 'Installing nodejs and npm'
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install nodejs
sudo apt-get install build-essential

echo 'Installing npm dependences'
cd $FRONTEND_PROJECT_DIRECTORY
sudo npm install

echo 'Installing bower and bower dependeces'
sudo npm install -g bower
sudo bower install --allow-root

echo 'Installing gulp'
sudo npm install -g gulp


# Open terminal
# cd workflow/
# vagrant ssh
# cd workflow/spa
# gulp
# http://localhost:9090/

# Open new terminal
# cd workflow/
# vagrant ssh
# cd workflow/api
# python manage.py runserver 0.0.0.0:8000
# http://localhost:9000/



#  server
#  testing uwsgi functionality
#  uwsgi --http :8080 --home /root/Env/workflow --chdir /root/workflow/api/ -w _api.wsgi
