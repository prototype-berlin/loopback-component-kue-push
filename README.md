# loopback-component-kue-push

> A handy loopback component to send push notifications for iOS and Android using kue.

## Installation

````
npm i loopback-component-kue-push --save
````

## Configuration

Add a ``loopback-component-kue-push`` object to your project's ``component-config.json``:

````json
"loopback-component-kue-push": {
    "redis": {
      "host": "127.0.0.1",
      "port": 6379,
    },
    "pushSettings": {
      "apn": {
        "token": {
          "key": "./AuthKey.p8",
          "keyId": "<KEY_ID>",
          "teamId": "<TEAM_ID>"
        },
        "production": false,
      },
      "gcm": {
        "id": "<SERVER_KEY>"
      }
    }
  }
````

When no redis configuration is added, defults shown will be used.

For the actual push configuration (``pushSettings``) also see [node-pushnotifications](https://www.npmjs.com/package/node-pushnotifications) package.

## Usage example

In your model.js you can send push notifications like this:

````javascript
module.exports = function(Model) {

  Model.afterRemote('create', (context, next) => {

    var push = Model.app.push;

    push.send({
      token: ['TOKEN_1', 'TOKEN_2'], // string or array of push registration tokens
      message: {
        title: 'YEAH!',
        body: 'Such notification!',
        topic: 'com.example.app',
        sound: 'default',
      }
    }, (error, response) => {
      if (error) {
        // something went wrong adding the job to the que
        return console.error(error);
      }

      console.log(response);
    });

    next();

  });

};
````

For all options concerning the message (sound, badge count etc.) see the [node-pushnotifications](https://www.npmjs.com/package/node-pushnotifications) package documentation.