var zetta = require('zetta');
var Automobile = require('../index');
var argv = require('minimist')(process.argv.slice(2));

var increment = argv['i'];

zetta()
  .use(Automobile, {increment: increment})
  .listen(1337);
