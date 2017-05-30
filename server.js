// modules =================================================
var express    		= 	require('express'),
app            		= 	express(),
path				      = 	require('path'),
mongoose       		= 	require('mongoose'),
bodyParser     		= 	require('body-parser'),
passport          =   require('passport'),
methodOverride 		= 	require('method-override'),
flash          		= 	require('connect-flash'),
expressValidator 	= 	require('express-validator'),
morgan 				    = 	require('morgan'),
cookieParser      =   require('cookie-parser'),	
db                =   require('./config/db'),
port              =   process.env.PORT || 3000; 

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public')); 
//app.use(express.static('public'))
//app.use('/public', express.static(path.join(__dirname, 'public')));

 //CORS support
 app.use(function(res,res,next){
 	res.header('Access-Control-Allow-Orgin','*');
 	res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
 	res.header('Access-Control-Allow-Headers','Content-Type');
 	next();
 });


 app.use(cookieParser());

 // Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash
app.use(flash());
// log every request to the console
app.use(morgan('dev')); 
//app.use('/api',api);


//passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); 

require('./app/routes/core.route')(app);

// config files
mongoose.connect(db.url); 
// connect to our mongoDB database

mongoose.connection.on('connected', function () {  
		
	console.log(port+"Running on ")
}); 
app.listen(port); 
// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

exports = module.exports = app; 
