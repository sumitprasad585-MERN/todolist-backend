const AppError = require("../utils/appError");

const sendErrorForDevelopmentEnv = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  res.status(statusCode).json({
    status,
    message: err.message,
    err,
    stack: err.stack
  });
};

const sendErrorForProductionEnv = (err, res) => {
  if (err.isOperationalError) {
    const { status, message, statusCode } = err;
    res.status(statusCode).json({
      status,
      message
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error! Something Went Wrong'
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDevelopmentEnv(err, res);
  } else {
    let error = Object.create(err);

    /** Handle Cast Error */
    if (error.name === 'CastError') {
      const invalidID = error.value;
      const message = `Invalid ID: ${invalidID}`;
      error = new AppError(404, message);
    }

    /** Handle Validation Errors */
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(current => current.message).join('. ');
      error = new AppError(400, message);
    }

    /** Handle Duplicate value error */
    if (error.code === 11000) {
      const duplicateKeyValue = Object.entries(error.keyValue)[0];
      const message = `Duplicate value for field ${duplicateKeyValue[0]}: ${duplicateKeyValue[1]}`
      error = new AppError(400, message);
    }

    /** Handle the JsonWebTokenError and TokenExpiredError */
    if (error.name === 'JsonWebTokenError') {
      const message = 'The access token is invalid. Please login again';
      error = new AppError(401, message);
    }

    if (error.name === 'TokenExpiredError') {
      const message = 'Token Expired! Please login again';
      error = new AppError(401, message);
    }

    sendErrorForProductionEnv(error, res);
  }
}

module.exports = {
  globalErrorHandler
};
