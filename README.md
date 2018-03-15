# React Dashboard PI
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) 

A dashboard to use with a Raspberry PI and it's screen between 3.5 to 7"

## Features
+ ES6 and greater => ES5 code transpiling (with Babel)
+ Styling with SASS
+ File bundling with webpack
+ local development with the webpack development server
+ RATP, WEATHER, PLANT COMPONENTS

## Requirements
To run this project, you’ll need to install [node 5 and above](https://nodejs.org/en/). The latest version of Node.js is recommended. 

The dependencies of this project are managed with node package manager, npm for your dependency management.

## Setting up
+ Clone this project to any folder on your local machine
```bash
git clone https://github.com/stormsa/dashboard_pi.git <FOLDER_NAME_HERE>
```
+ Navigate into the folder name specified
```bash
cd <FOLDER_NAME_HERE>
```

## Installing Packages

With NPM
```bash 
npm install
```

## Runnning the bundle

```bash
 npm run build
```
## Running the app in Development

Run `npm start` to intialize and run the webpack development server. Navigate to [http://localhost:3000/](http://localhost:3000). The app will automatically reload if you change any of the source files.

## Running the app in Production

To run the app in production build of the app, use either of the following.

```bash
 npm start
```