const supertokens = require('supertokens-node');

supertokens.init({
  supertokens: {
    connectionURI: process.env.SUPER_TOKENS_CONNECTION_URI,
    apiKey: process.env.SUPER_TOKENS_API_KEY,
  },
});
