# React Dashboard PI
![Dashboard PI](dashboardPi.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) 

A dashboard to use with a Raspberry PI and it's screen between 3.5 to 7" inch

## Tech
+ React Front application
+ Python3 with Flask Server 
+ Node Package Manager 
+ File bundling with Webpack
+ ES6 and greater => ES5 Code transpiling (with Babel)
+ Styling with SASS

## Features

+ Display RATP Traffic and schedules 
+ Display weather
+ Manage Xiaomi Yeelight bulb (Autodetect, turn on and turn off)


## Requirements

* [NPM](https://www.npmjs.com/)
* [Python3](https://www.python.org/downloads/)

## Getting start


Clone this project to any folder on your local machine
```bash
git clone https://github.com/stormsa/dashboard_pi.git <FOLDER_NAME_HERE>
```
Navigate into the folder name specified
```bash
cd <FOLDER_NAME_HERE>
```

+ Installing Packages

With NPM for front and pip for server
```bash 
npm install
pip3 install -r requirements.txt
```

## Running project in Development

+ Rendering app with webpack development server (python server is not started)

```bash
npm run start
```

The app will automatically reload if you change any of the source files)
Navigate to [http://localhost:3000/](http://localhost:3000). 


+ Rendering app with python server
```bash
 npm run startwithserver
```

Navigate to [http://localhost:5000/](http://localhost:5000).

## Build app for production

```bash
 npm run build:production
```
(copy dist folder in your server with python server)

## Edit autostart raspberry
```bash
 sudo cp dashboardPi.service /lib/systemd/system/
 sudo nano /lib/systemd/system/pythonPi.service
 sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
 sudo systemctl status pythonPi.service
```

## Sources

[Yeelight Api](https://yeelight.readthedocs.io/en/latest/)

[Ratp Api](https://api-ratp.pierre-grimaud.fr/v3)
