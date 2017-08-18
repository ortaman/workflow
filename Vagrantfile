
# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Insert config options here
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 8080, host: 9090      # SPA
  config.vm.network "forwarded_port", guest: 8000, host: 9000      # API
  config.vm.network "forwarded_port", guest: 8081, host: 8180      # SELENIUM
  config.vm.network "forwarded_port", guest: 5432, host: 3254      # DB
  config.vm.network "forwarded_port", guest: 35729, host: 35729    # LIVERELOAD

  config.vm.synced_folder ".", "/home/vagrant/workflow"
  config.vm.provision "shell", path: "setup.sh"

end
