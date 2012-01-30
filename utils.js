exports.locals = { 
  title : 'collabow'
  ,description: 'Brainstorm real-tile with anyone anywhere'
  ,author: 'Troy Astorino'
  ,analyticssiteid: 'XXXXXXX' 
};

exports.error = function(res, err) {
  res.json({
    result: err.name,
    msg: err.message,
  });
};

exports.success = function(res) {
  res.json({
    result: "success"
  });
};
