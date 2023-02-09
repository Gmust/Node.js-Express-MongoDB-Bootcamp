const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL,{  dbName: 'natours',}).then(() => {
  console.log('DB connected');
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});