const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();


  // 2) Build template
  // 3) Render Template
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = (req, res) => {



  res.status(200).render('tour', {
    title: 'The forest hiker'
  });
};