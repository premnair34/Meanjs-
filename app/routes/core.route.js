module.exports = function(app) {	
	require('./user.route')(app);
	require('./book.route')(app);

	//app.put('/api/verifyEmail', );

	//app.put('/api/updateProfile', );


	
	
};