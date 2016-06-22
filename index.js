var Device = require('zetta-device');
var util = require('util');

var TIMEOUT = 3000;
var INTERVAL = 1000;

function degToRad(x) {
  return x * ( Math.PI / 180 );
}

var Automobile = module.exports = function(opts) {
  Device.call(this);
  this.opts = opts || {};

  this._lastState = 'park';

  this.acceleratorPedalPosition = 0.0;
  this.engineSpeed = 0.0;
  this._engineSpeedHigh = 8000.0;
  this.fuelLevel = 1.0;
  this.fuelConsumedSinceRestart = 0.0;
  
  this._nissanLatitude = 42.494132;
  this._nissanLongitude = -83.426378;
  this._slowsLatitude = 42.331859;
  this._slowsLongitude = -83.076048;
  this._latDiff = this._nissanLatitude - this._slowsLatitude;
  this._lngDiff = this._nissanLongitude - this._slowsLongitude;

  this.latitude = this._nissanLatitude;
  this.longitude = this._nissanLongitude;

  this.odometer = 1000;

  this.vehicleSpeed = 0;
  this._vehicleSpeedIncrement = 2;
  this._vehicleSpeedHigh = 321.0;
  this._vehicleSpeedTimeOut = null;
  this._vehicleSpeedCounter = 0;

};
util.inherits(Automobile, Device);

Automobile.prototype.init = function(config) {
  var name = this.opts.name || 'Automobile';

  config
    .name(name)
    .type('automobile')
    .state('park')
    .when('park', {allow: ['make-ready']})
    .when('first', {allow: ['make-not-ready']})
    .when('second', {allow: ['make-not-ready']})
    .when('third', {allow: ['make-not-ready']})
    .when('fourth', {allow: ['make-not-ready']})
    .when('fifth', {allow: ['make-not-ready']})
    .when('sixth', {allow: ['make-not-ready']})
    .when('seventh', {allow: ['make-not-ready']})
    .when('eighth', {allow: ['make-not-ready']})
    .map('make-not-ready', this.makeNotReady)
    .map('make-ready', this.makeReady)
    .monitor('acceleratorPedalPosition')
    .monitor('engineSpeed')
    .monitor('fuelLevel')
    .monitor('fuelConsumedSinceRestart')
    .monitor('latitude')
    .monitor('longitude')
    .monitor('odometer')
    .monitor('vehicleSpeed')
};

Automobile.prototype.makeReady = function(cb) {
  this.state = this._lastState;
  this._startMockData(cb);
  cb();
}

Automobile.prototype.makeNotReady = function(cb) {
  this._lastState = this.state;
  this.state = 'park'
  this._stopMockData(cb);
  cb();
}

Automobile.prototype._startMockData = function(cb) {
  var self = this;
  this._vehicleSpeedTimeOut = setInterval(function() {
    self.vehicleSpeed = (Math.sin(degToRad(self._vehicleSpeedCounter)) + 1.0) * self._vehicleSpeedHigh / 2;
    self.state = self._stateFromVehicleSpeed(self.vehicleSpeed);
    self._vehicleSpeedCounter += self._vehicleSpeedIncrement;
    self.acceleratorPedalPosition = self.vehicleSpeed / self._vehicleSpeedHigh;
    self.engineSpeed = self.acceleratorPedalPosition * self._engineSpeedHigh;
    self.fuelConsumedSinceRestart += 0.01 * self.acceleratorPedalPosition;
    self.fuelLevel = 100 - self.fuelConsumedSinceRestart;
    self.latitude = self._slowsLatitude + self._latDiff * self.acceleratorPedalPosition;
    self.longitude = self._slowsLongitude + self._lngDiff * self.acceleratorPedalPosition;
    self.odometer += self.vehicleSpeed / 3.6e+6;
    cb();
  }, INTERVAL);
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
  default:
    return 'eighth';
  }
}