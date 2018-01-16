const env = {};

const NODE_ENV_PRODUCTION = 'production';
const NODE_ENV_DEVELOPMENT = 'development';

env.getNodeEnv = function() {
  return process.env.NODE_ENV;
};

env.isProduction = function() {
  return process.env.NODE_ENV === NODE_ENV_PRODUCTION;
};

env.notProduction = function() {
  return process.env.NODE_ENV !== NODE_ENV_PRODUCTION;
};

env.isDevelopment = function() {
  return process.env.NODE_ENV === NODE_ENV_DEVELOPMENT;
};

env.notDevelopment = function() {
  return process.env.NODE_ENV !== NODE_ENV_DEVELOPMENT;
};

module.exports = env;
