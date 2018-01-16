const path = require('path');

const { extname } = path;

const util = {
  isMarkdown(file) {
    return /\.md|\.markdown/.test(extname(file));
  }
};

module.exports = util;
