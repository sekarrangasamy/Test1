var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(expressValidator([]));

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Mongodb connection.
mongoose.connect('');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

var User = mongoose.model('User', userSchema);

app.get('/users', function(req, res) {
	User.find({}, null, function(err, users) {
		res.send(users);
	});
})

app.post('/user', function(req, res) {
	req.checkBody('name', 'Missing Params').notEmpty();
	req.checkBody('username', 'Missing Params').notEmpty();
	req.checkBody('password', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.send(errors);
		return;
	}

	var newUser = new User({
		name: req.body.name,
		username: req.body.username,
		password: req.body.password
	});

	console.log('newUser', newUser);

	newUser.save(function(err, user) {
		if (err) res.send(err);
		res.send({
			'msg': 'User created!',
			'user': user
		});
	});
});

app.get('/users/:id', function(req, res) {
	req.checkParams('id', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.send(errors);
		return;
	}
	var userid = req.params.id;
	User.findById(userid, null, function(err, user) {
		res.send(user);
	});
});

app.put('/users/:id', function(req, res) {
	req.checkParams('id', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.send(errors);
		return;
	}
	var userId = req.params.id;
	User.findById(userId, null, function(err, user) {
		user.name = req.body.name,
		user.username = req.body.username,
		user.password = req.body.password

		user.save(function(err) {
			if (err) res.send(err);
			res.send({
				'msg': 'User updated!'
			});
		});
	});
});

app.delete('/users/:id', function(req, res) {
	var userId = req.params.id;
	User.findByIdAndRemove(userId, function(err) {
		if (err) res.send(err);
		res.send({
			'msg': 'User deleted!'
		});
	});
});

var server = app.listen(8081, function() {
	console.log("Example app listening on port: 8081")
});
