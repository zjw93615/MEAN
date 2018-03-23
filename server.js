const express   = require('express');
const app       = express();
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var router      = express.Router();
var appRoutes   = require('./app/routes/api')(router);
var path        = require('path');
var passport    = require('passport');
require('./app/passport/passport')(app, passport);

app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);


mongoose.connect('mongodb://jiaweiz:4cXtPTXWunsl8qkK@cluster0-shard-00-00-roljo.mongodb.net:27017,cluster0-shard-00-01-roljo.mongodb.net:27017,cluster0-shard-00-02-roljo.mongodb.net:27017/mean?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connect successfully');
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


var port = process.env.PORT || 8080;
app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
