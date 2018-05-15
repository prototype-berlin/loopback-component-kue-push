'use strict'

const kue = require('kue');
const EventEmitter = require('events').EventEmitter;
const debug = require('debug')('loopback:component:kue-push');
const pushHandler = require('./lib/push-handler');

module.exports = function (app, options) {
  debug('Setting up component');

  const defaultOptions = {
    namespace: 'push',
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
  }

  options = Object.assign({}, defaultOptions, options);

  let push = app[options.namespace] = new EventEmitter();

  debug('Create push notifications queue');
  var pushQueue = kue.createQueue({
    redis: {
      host: options.redis.host,
      port: options.redis.port,
    }
  });

  pushQueue.on('error', function (err) {
    debug('Queue error: ', err.Error);
  });

  pushQueue.process('push', function (job, done) {
    debug('Push from queue is about to be processed');
    sendPush(job.data, function (error, response) {
      if (error) {
        push.emit('error', error);
        debug('Error sending push with job id: %d', job.id);
      } else {
        push.emit('done', response);
        debug('Push with job id "%d" was successfully sent.', job.id);
      }
      done();
    })
  });

  let sendPush = pushHandler(options.pushSettings);

  push.send = function(data, callback) {

    let job = pushQueue.create('push', data).save(function (error) {
      if (error) {
        debug('Error adding job to the queue.');
        callback({
          status: error.message,
          jobId: job.id,
        }, null);
      } else {
        debug('Job has been added to the queue.');
        callback(null, {
          status: 'added to queue',
          jobId: job.id,
        });
      }
    });
  }

}
