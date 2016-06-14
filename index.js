var Device = require('zetta-device');
var util = require('util');

var TIMEOUT = 3000;
function degToRad(x) {
  return x * ( Math.PI / 180 );
}

var Automobile = module.exports = function(opts) {
  Device.call(this);
  this.opts = opts || {};

  this.vehicleSpeed = 0;
  this._vehicleSpeedIncrement = 2;
  this._vehicleSpeedHigh = 321;
  this._vehicleSpeedTimeOut = null;
  this._vehicleSpeedCounter = 0;

};
util.inherits(Automobile, Device);

Automobile.prototype.init = function(config) {
  var name = this.opts.name || 'Automobile';

  config
    .name(name)
    .type('automobile')
    .state('not-ready')
    .when('not-ready', {allow: ['make-ready']})
    .when('first', {allow: ['make-not-ready']})
    .when('second', {allow: ['make-not-ready']})
    .when('third', {allow: ['make-not-ready']})
    .when('fourth', {allow: ['make-not-ready']})
    .when('fith', {allow: ['make-not-ready']})
    .when('sixth', {allow: ['make-not-ready']})
    .when('seventh', {allow: ['make-not-ready']})
    .when('eigth', {allow: ['make-not-ready']})
    .map('make-not-ready', this.makeNotReady)
    .map('make-ready', this.makeReady)
    .monitor('vehicleSpeed');
};

Automobile.prototype.makeReady = function(cb) {
  this.state = 'first';
  this._startMockData(cb);
  cb();
}

Automobile.prototype.makeNotReady = function(cb) {
  this.state = 'not-ready'
  this._stopMockData(cb);
  cb();
}

Automobile.prototype._startMockData = function(cb) {
  var self = this;
  this._vehicleSpeedTimeOut = setInterval(function() {
    self.vehicleSpeed = (Math.sin(degToRad(self._vehicleSpeedCounter)) + 1.0) * self._vehicleSpeedHigh / 2;
    self.state = self._stateFromVehicleSpeed(self.vehicleSpeed);
    self._vehicleSpeedCounter += self._vehicleSpeedIncrement;
    cb();
  }, 100);
}

Automobile.prototype._stopMockData = function(cb) {
  clearTimeout(this._vehicleSpeedTimeOut);
  cb();
}

Automobile.prototype._stateFromVehicleSpeed = function(vehicleSpeed) {
  var gearRange = this._vehicleSpeedHigh / 8;
  var gear = Math.floor(vehicleSpeed / gearRange) + 1;
  switch(gear) {
  case 1:
    return 'first';
  case 2:
    return 'second';
  case 3:
    return 'third';
  case 4:
    return 'fourth';
  case 5:
    return 'fifth';
  case 6:
    return 'sixth';
  case 7:
    return 'seventh';
  case 8:
    return 'eighth';
  }
}