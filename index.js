const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
dotenv.config({ path: './config.private.env' });

const app = require('./app');

const PORT = 5858;
const server = app.listen(PORT, () => {
  console.log(`Listening to requests on PORT ${PORT}`);
});

server.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection 💣💥');
  console.log(err);
  console.log('Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

server.on('uncaughtException', (err) => {
  console.log('Uncaught Exception 💣💥');
  console.log(err);
  console.log('Shutting down...');
  process.exit(1);
});
