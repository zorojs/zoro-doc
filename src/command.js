const Command = require('common-bin');
const util = require('./util');

const UTIL = Symbol('ZoroDocCommand#util');

class ZoroDocCommand extends Command {
  get util() {
    if (!this[UTIL]) {
      this[UTIL] = Object.assign({}, super.helper, util);
    }
    return this[UTIL];
  }
}

module.exports = ZoroDocCommand;
