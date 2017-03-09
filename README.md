### Requirements

* [Vagrant](https://www.vagrantup.com/downloads.html)

### Set up development environment

* Run the following command to setup virtual environment
(it may take a while the first time).

'''
$ vagrant up
'''

* When the virtual environment is ready, establish a connection with the
following command.

'''
$ vagrant ssh
'''




*  Open console go to the api directory, establish a connection and run the django server.

'''
$ cd dworkflow/
$ vagrant ssh
$ cd dworkflow/api
$ python manage.py runserver 0.0.0.0:8000 
'''

* Go to the link:
'''
http://localhost:9000/
'''



* In a new console go to the spa directory, establish a connection and run single page application server.

'''
$ cd dworkflow/
$ vagrant ssh
$ cd dworkflow/spa
$ gulp
'''

* Go to the link:
'''
http://localhost:9090/
'''

* TO PRODUCTION
Add the file 'production.py' in the 'webapp-kroo/api/kroo/keys' directory
Change the api url and the angular application debug to false 
add the files in the .gitignore file.
