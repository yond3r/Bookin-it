const mongoose = require('mongoose');

//so mongoose 6 says that useCreateIndex and useFindAndMotify are no longer supported? I don't know if there is anything to replace them with. 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

module.exports = mongoose.connection;
