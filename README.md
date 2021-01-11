Tweet Seeker API
====================

This backend application responds to the requeriments of streaming public tweets.

The app is developed in NodeJS using socket.io for living communication with web clients in order to stream new tweets. Also use express as http manager and middleware.

The app has been developing for training purposes.

### Demo

Demo application deployed on heroku. (https://tweet-seeker-api.herokuapp.com/)

### Swagger

Check Api constract and test it from web interface:  
http://[host]:[port]/api-docs/

### Build&Run Commands

**Install packages and globals**

`$ npm install`

**Utility for server reloading when detecting file changes**

`$ npm install -g nodemon`

**Build the application**

`$ npm run build`

**Run a local dev server**

`$ npm run start:dev`

**Run the app in VSCode with debug mode**

The application contains a `launch.json` config file stored in `.vscode` folder. It enables a debug run in VSCode IDE.
