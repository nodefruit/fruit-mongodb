var config = {};

if(process.env.HOST && process.env.DB && process.env.PORT) {
  config = {
      host                : process.env.HOST
    , database            : process.env.DB
    , port                : process.env.PORT
  }
} else {
  console.log(' You need to specify database information as environment variables ');
  console.log(' Make sure to specify a new and empty database for test            ');
  console.log(' example :                                                         ');
  console.log(' HOST="localhost" DB="test" PORT="27017" npm test                  ');
  throw new TypeError('');
}

module.exports = config;