var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

var UserSchema = Schema(
	{
		name:{
			type: String,
			required: true 
		},
		email: {
			type: String,
			required: "please enter email",
			unique: "Email is already taken",
			lowercase: true,
			validate: [validateLocalStrategyProperty, 'Please fill in your email'],
			match: [/.+\@.+\..+/, 'Please fill a valid email address']
		},
		password:{
			type: String,
			required: true,
			validate: [validateLocalStrategyPassword, 'Password should be longer']
		},	
		verified:{ 
			type: Boolean, 
			required: true
		},
		created: { 
			type: Date, 
			default: Date.now 
		},
		updated: {
			type: Date
		},
		token: {
			type: String
		},
		provider: {
			type: String,
			required: 'Provider is required'
		},
		providerData: {},
		additionalProvidersData: {},
		phone:{
			type:Number,
			unique:true,
			default:null
		},
		location:{
			type:String,
			default:null
		},resetPasswordToken: {
			type: String
		},
		resetPasswordExpires: {
			type: Date
		}
	},{ versionKey: false}
);

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function (password,password1) {
 	return bcrypt.compareSync(password,password1);
}

module.exports.getUserById = function(id,callback){
	console.log('get user')
	User.findById(id,callback);
}

module.exports.getUserByEmail = function(email,callback){
	const query = {'email':email}
	User.findOne(query,callback);
}

module.exports.sendMail = function(user){
	user.encrypteEmail = new Buffer(user.email).toString('base64')
	res.render('views/templates/welcome-email', {
		name: user.name,
		appName: config.app.title,
		url: 'http://' + req.headers.host + '/api/verifyEmail/' + user.encryptEmail
	}, function(err, emailHTML) {
		done(err, emailHTML, user);
	});
	var smtpTransport = nodemailer.createTransport(config.mailer.options);
	var mailOptions = {
		to: user.email,
		from: "noreply@rio.com",
		subject: 'Welcome to RIO',
		html: emailHTML
	};
	smtpTransport.sendMail(mailOptions, function(err) {
		if (!err) {
			res.send({
				message: 'An email has been sent to ' + user.email + ' to verify your account.'
			});
		}
		done(err);
	});
};

UserSchema.pre('save',function (next) {
	var user = this;	
    if (!user.isModified('password')) return next(err);
	 // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });   
});
