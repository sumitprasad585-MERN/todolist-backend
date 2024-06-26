const sendErrorForDevelopmentEnv = (err, res) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    err,
    message: err.message,
    stack: err.stack
  });
}

const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDevelopmentEnv(err, res);
  } else {

  }
}

module.exports = {
  globalErrorHandler
};
