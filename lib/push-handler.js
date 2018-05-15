const PushNotifications = new require('node-pushnotifications');

module.exports = function (options) {

  return function sendPush (data, callback) {
    const push = new PushNotifications(options);

    push.send(data.token, data.message).then((response) => {
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
    });
  }
}
