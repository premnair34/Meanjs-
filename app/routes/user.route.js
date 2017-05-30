'use strict';

module.exports = function(app) {
	var user = require('../controller/user.server');
	app.route('/api/registration').post(user.signup);
	app.route('/api/login').post(user.sigin);	
	app.route('/api/updateProfile').put(user.updateProfile);
	app.route('/api/verifyEmail/:encMail').get(user.verifyEmail);
	app.route('/api/resendActivation/:email').get(user.resendEmail);
}