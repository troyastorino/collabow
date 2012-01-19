exports.locals = { 
  title : 'collabow'
  ,description: 'Your Page Description'
  ,author: 'Your Name'
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
