const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const todoRouter = require('./routes/todoRoutes');
const userRouter = require('./routes/userRoutes');
const { globalErrorHandler } = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));

// app.use(express.json());
app.use(bodyParser.json());

/* Mount the routers */
app.use('/api/v1/todos', todoRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
  const message = `${req.method} to resource ${req.originalUrl} not found on the server ${req.protocol}://${req.hostname}`;
  next(new AppError(404, message));
});

app.use(globalErrorHandler);

module.exports = app;
