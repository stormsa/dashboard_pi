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
	echo "Installing dashboard ..."

	echo "Updating the package database"
	
	apt update upgrade
	
	echo "Update ok"
	
	echo "Installing python, npm and git"
	
	apt-get install git npm python3-picamera python3-pip
	
	echo "Install ok"
	
	# Download sources
	git clone https://github.com/stormsa/dashboard_pi.git /home/pi/Documents/
	
	cd /home/pi/Documents/dashboard_pi
	
	# Install Front
	(cd Front; npm install; npm run build :production)
	
	# Install server 
	cd Server
	pip -r install requirements.txt)
	chmod +x server.py
	
	# Set dashboard_pi as service
	cp dashboardPi.service /lib/systemd/system/
	
	# Activate service
	systemctl daemon-reload
	systemctl enable dashboardPi.service
	systemctl start dashboardPi.service
	
	nano /home/pi/.config/lxsession/LXDE-pi/autostart
	
	echo @chromium-browser --kiosk --disable-session-crashed-bubble --disable-infobars http://127.0.0.1:5000/ >> /home/pi/.config/lxsession/LXDE-pi/autostart
	
	restart
}
installDashBoard





