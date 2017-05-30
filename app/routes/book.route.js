'use strict';
var passport = require('passport'),
jwt = 	require('jsonwebtoken');

module.exports = function(app) {
	var book = require('../controller/book.controller');
	app.route('/api/getbooking/:id').get(book.allBooking);
	app.route('/api/postComment').put(book.postComments);	
	app.route('/api/requestbook').post(book.requestRide);	
	app.get('/api/auth',book.authenticate);
	//,passport.authenticate('jwt',{session:false})
}
