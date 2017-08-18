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

echo 'Installing RabbitMQ'
sudo apt-get install -y rabbitmq-server


echo 'Install pip python3'
sudo apt-get install -y python3-pip

echo 'Installing project dependencies (requirements file)'
sudo pip3 install -r $BACKEND_PROJECT_DIRECTORY/_requirements/development.txt

echo 'Running project migration files'
python3 $BACKEND_PROJECT_DIRECTORY/manage.py migrate


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



# Intalling PhantomJS to headless testing of the web application.
sudo apt-get update
sudo apt-get install build-essential chrpath libssl-dev libxft-dev -y
sudo apt-get install libfreetype6 libfreetype6-dev -y
sudo apt-get install libfontconfig1 libfontconfig1-dev -y

sudo export PHANTOM_JS="phantomjs-2.1.1-linux-x86_64"
sudo wget https://github.com/Medium/phantomjs/releases/download/v2.1.1/$PHANTOM_JS.tar.bz2
sudo tar xvjf $PHANTOM_JS.tar.bz2
sudo mv $PHANTOM_JS /usr/local/share
sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin



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


# Run celery worker and beat load (in one command).
# cd workflow/api
# celery -A _api worker --beat --scheduler django --loglevel=info



# ********   only if is necesary to user many workers separate the workers and the beat.  **********
# open terminal
# cd workflow/api
# celery -A _api worker -l info

# Start the celery beat service using the django scheduler
# cd workflow/api
# celery -A _api beat -l info -S django



# ********   Run celery worker and beat using supervisord  **********
# sudo supervisorctl reread
# sudo supervisorctl update
# sudo supervisorctl start workflow-celery
# sudo supervisorctl start workflow-celerybeat

# sudo tail -f /home/wfuser/workflow/logs/celery-worker.log
# sudo tail -f /home/wfuser/workflow/logs/celerybeat.log




#  server
#  testing uwsgi functionality
#  uwsgi --http :8080 --home /root/Env/workflow --chdir /root/workflow/api/ -w _api.wsgi
