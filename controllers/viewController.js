exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    tour: 'The forest hiker'
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The forest hiker'
  });
};