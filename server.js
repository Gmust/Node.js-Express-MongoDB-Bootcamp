const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

process.on('uncaughtException', err => {
  console.log('Uncaught exception! Shutting down server...');
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL, { dbName: 'natours' })
  .then(() => {
    console.log('DB connected');
  })
  .catch();


const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection! Shutting down server....');
  server.close(() => {
    process.exit(1);
  });
});
