#!/bin/bash

### Install dashboard on raspberry ###

function isRoot () {
	if [ "$EUID" -ne 0 ]; then
		return 1
	fi
}

installDashBoard() {
	if ! isRoot; then
		echo "Sorry, you need to run this as root"
		exit 1
	fi

	if [[ -z $1 && -z $2 ]]; then
		echo "Sorry, you need to provide name and mail for git"
		exit 1
	fi

	echo "Installing dashboard ..."

	echo "Updating the package database"
	
	apt-get update
	apt-get upgrade
	apt-get autoremove
	
	echo "Update ok"
	
	echo "Installing node and npm"
	if which npm > /dev/null
    then
        echo "Node is installed, skipping..."
    else
    	apt-get install nodejs npm node-semver
    fi

    npm cache clean -f
    npm install npm@latest -g

	echo "Installing python and git"
	
	apt-get install git python3-picamera python3-pip
	
	echo "Install done"
	git config --global user.name "$1"
	git config --global user.email "$2"
	
	# Download sources
	cd /home/pi/Documents/

	if [ ! -d dashboard_pi ] ;then
		git clone https://github.com/stormsa/dashboard_pi.git
	fi
	
	cd dashboard_pi
	
	echo "Installing Front"
	cd Front
	npm install --unsafe-perm --no-optional --no-shrinkwrap --no-package-lock
	npm run build:production
	cp -r dist ../Server/
	cp -r public ../Server/

	
	echo "Installing back"
	cd ../Server
	pip install -r requirements.txt
	chmod +x server.py
	
	# Set dashboard_pi as service
	cp dashboardPi.service /lib/systemd/system/
	
	# Activate service
	systemctl daemon-reload
	systemctl enable dashboardPi.service
	systemctl start dashboardPi.service
	
	echo @chromium-browser --kiosk --disable-session-crashed-bubble --disable-infobars http://127.0.0.1:5000/ >> /home/pi/.config/lxsession/LXDE-pi/autostart
	
	reboot
}

installDashBoard $1 $2





