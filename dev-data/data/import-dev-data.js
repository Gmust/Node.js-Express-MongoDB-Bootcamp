const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');


mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://reflexive:gachitop@cluster0.8vjgihj.mongodb.net/?retryWrites=true&w=majority', { dbName: 'natours' }).then(() => {
  console.log('DB connected');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));


const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Created!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);