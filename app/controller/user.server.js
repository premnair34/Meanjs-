'use strict';
var User 			= 	require('../models/user.model'),
errorHandler 		= 	require('../controller/error.server'),
bcrypt 				= 	require('bcrypt'),
nodemailer 			= 	require('nodemailer'),
passport 			= 	require('passport'),
path				=	require('path'),
jwt 			 	= 	require('jsonwebtoken'),
db                	=   require('../../config/db'),
crypto				=	require('crypto'),
async 				= 	require('async');
//console.log(User)
exports.signup = function(req,res,next) {	
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	req.checkBody('name', 'Please enter Name').notEmpty();
	req.checkBody('email', 'Please enter Email').notEmpty();
	req.checkBody('email', 'Please enter valid Email').isEmail();
	req.checkBody('password', 'Please enter Password').notEmpty();
	var errors = req.validationErrors();
	//console.log(errors[0].msg)
	if (errors) {
		return res.status(200).send({
			err:true,
			data:null,
			errText:errors[0].msg
		});
	}else{
		async.waterfall([			
			// Lookup user by email
			function(done) {
				User.getUserByEmail(email,function(err,isEmail){
					if (err) 
						return res.status('200').json({'err':true,'data':null,errText:err});
					else if(isEmail){		
						return res.status('200').json({'err':true,'data':null,errText:'Your email is already registered please kindly login'});
					}else{
						var user = new User();
						user.name = name;
						user.email = email;
						user.password = password;
						user.provider = 'local';
						user.verified = false;	
						user.token = null;	
						user.save(function(err,doc) {
							done(err,doc);	
						});	
					}
				});	
			},
			function(user, done) {				
				user.password = undefined;
				user.encryptEmail = new Buffer(user.email).toString('base64');	
				var email = sendMail(user,req)			
				email.smtp.sendMail(email.mail, function(err) {
					if (!err) {
						return res.status('200').json({'err':false,'data':user});						
					}else{
						return res.status('200').json({'err':true,'errText':err,'data':null});
					}
				});		
			}
		], function(err) {
			if (err) return next(err);
			//return res.status('200').json({'err':true,'data':null,errText:err});
		});
	}		
};

function sendMail(user,req){
	var smtpTransport = nodemailer.createTransport({
         service: "Gmail",
         auth: {
             user: "premnair.r@gmail.com",
             pass: "premchand"
         }
     });
	var mailOptions = {
		to:user.email,// "premnair.r@gmail.com",
		from: '<activate@rioridersmail.com>',
		subject: 'One More Step -  To Verify Your Account',
		html:`<!DOCTYPE html>
				<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
				<head>
				</head>
				<body>
					<p>Dear ${user.name},</p>
					<p>Welcome to RIO</p>
					<p>Click on the Confirm Email to your right to kickstart your hassle free</p>
					<br>
					<br>
					<a href="http://${req.headers.host}/verifyEmail/${user.encryptEmail}">Confirm Email</a>
					<p>Follow Us</p>
					<p>To Unsubscribe click here</p>
				</body>
			</html>`
	};
	return {
		smtp:smtpTransport,
		mail:mailOptions
	}
}

exports.sigin = function(req, res) {
	req.checkBody('email', 'Please enter Email').notEmpty();
	req.checkBody('email', 'Please enter valid Email').isEmail();
	req.checkBody('password', 'Please enter Password').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		return res.status(200).send({
			err:true,
			data:null,
			errText:errors[0].msg
		});
	}else{
		const email = req.body.email;
		const password = req.body.password;
		User.getUserByEmail(email,(err,user) =>{
			if(err)
				return res.status('200').json({'err':true,'data':null,errText:"Something went wrong"})
			if(!user){
				return res.status('200').json({'err':true,'data':null,'errText':'User not Found'});
			}
			var isMatch = User.comparePassword(password,user.password);
			if(!isMatch)
				return res.status('200').json({'err':true,'errText':'Password is wrong'});
			else{
				user.password = undefined;
				const token = jwt.sign(user,db.secret,{expiresIn:6048000});
				return res.status('200').json({'err':false,'data':user,token:"JWT "+token});
			}			
		});		
	}
};

exports.resendEmail = function(req, res) {
	req.checkParams('email', 'Please enter Email').notEmpty();
	req.checkParams('email', 'Please enter valid Email').isEmail();
	var errors = req.validationErrors();
	if(errors){
		return res.status(200).send({
			err:true,
			data:null,
			errText:errors[0].msg
		});
	}else{
		var email = req.params.email;
		User.getUserByEmail(email,(err,userId) =>{
			if(err)
				return res.status('200').json({'err':true,'data':null,errText:"Something went wrong"})
			if(!user)
				return res.status('200').json({'err':true,'data':null,'errText':'User not Found'});
			else{				
				user.encryptEmail = new Buffer(user.email).toString('base64');
				var email = sendMail(user,req);			
				email.smtp.sendMail(email.mail, function(err) {
					if (!err) {
						console.log(200)
						return res.status('200').json({err:false,message:'An email has been sent to ' + user.email + ' with further instructions.'});						
					}else{
						return res.status('200').json({err:true,errText:err,data:null});
					}
				});	
			}
		});	
	}					
};

exports.verifyEmail = function(req, res) {
	req.checkParams('encMail', 'Please enter Email').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		return res.status(200).send({
			err:true,
			data:null,
			errText:errors[0].msg
		});
	}else{
		var decryptEmail = new Buffer(req.params.encMail, 'base64').toString();		
		User.findOneAndUpdate({email:decryptEmail,verified:false },{ $set: { verified:true}},
		{"upsert": true},function(err,doc) {
	     	if (err) {
				return res.status('200').json({'err':true,'data':null,errText:"Invalid Request"});
			}else{
				var data = {
					'name':doc.name,
					'email':doc.email,
					'verified':doc.verified,
					'_id':doc._id,
					'location':doc.location,
					'phone':doc.phone
				}
				return res.status('200').json({'err':false,data});
			}
	   });
	}					
};

exports.updateProfile = function(req, res) {
	req.checkBody('name', 'Please enter Username').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		return res.status(200).send({
			err:true,
			data:null,
			errText:errors[0].msg
		});
	}else{	
		var name = req.body.name || "",
		id = req.body.userId,
		phone = req.body.phone || "",
		location = req.body.location || "";	
		console.log(id)
		User.findOneAndUpdate({_id:id,verified:true},{ $set:{ name:name,phone:phone,location:location}},
		{"upsert": true},function(err,doc) {
	     	if (err) {
				return res.status('200').json({'err':true,errText:err});
			}else{
				doc.password = undefined;
				return res.status('200').json({'err':false,doc});
			}
	   });
	}					
};

exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;
	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};


