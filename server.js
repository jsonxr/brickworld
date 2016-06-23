var path = require('path');
var express = require('express');


var app = express();

app.use(express.static(path.join(__dirname, 'dist/client')));

// This is if all other routes drop out...
app.use(function(req, res) {
  res.status(404).send("File not found.");
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
