var express = require('express');			//we can use express now
var mongoose = require('mongoose');
var morgan = require('morgan');
var jwt    = require('jsonwebtoken'); 
var config = require('./config'); 
var User   = require('./models/user'); 
mongoose.connect('mongodb://localhost/questions');
var Question = require('./models/question');

var app = express();						//variable to allow use of express
var bodyParser = require("body-parser");	//takes text and makes in URL encoded data
app.use(express.static('public'))			//which page to be displayed (our index.html)

app.use(bodyParser.json());	
app.use(bodyParser.urlencoded({ extended: false }));				//makes sure URL encoded data is in JSON

// var questions = [{							//array of questions
// 	question: "Write a function to sum all of the numbers in an array.",
// 	id: 1,
// 	votes: 0
// },
// {
// 	question: "Write a function that takes an array of numbers and doubles all of them",
// 	id: 2,
// 	votes: 0
// }]

app.get("/api/questions", function(req, res) {	//pulls actual question of array to make list
	Question.find(function(err, questions){
		res.json(questions);
	});
});
	
app.post("/api/questions", function(req, res){	//takes user-typed question and posts to server
	//console.log(req.body);
	var obj = {
		question: req.body.question,
		votes: 0
	};
					//takes new obj and pushes to main questions array
	var question = new Question(obj);
	question.save(function(err, result){
		res.json(result);
	});
})

app.put("/api/questions/:id", function(req, res){
	var id = req.params.id;
	Question.findById(id, function(err, question){
		question.votes += 1;
		question.save(function(err, result){
			res.json(result);
		});
	});
})
// API ROUTES

var apiRoutes = express.Router(); 

apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

// API ROUTES -------------------


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});

app.use('/api', apiRoutes);

var apiRoutes = express.Router(); 


//Token stuffs----------------

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

//FAKE USER
app.get('/setup', function(req, res) {

// create a sample user
  var nick = new User({ 
    name: 'Nick Cerminara', 
    password: 'password',
    admin: true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});
///// THIS IS FOR USERS

var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
app.set('superSecret', config.secret); // secret variable



app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.listen(3000);
console.log('Magic happens at http://localhost:' + port);



