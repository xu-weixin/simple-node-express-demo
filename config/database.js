if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb://xuweixin:xuweixin1234@ds111638.mlab.com:11638/vidjot-production'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost:27017/vidjot-dev'
  };
}
