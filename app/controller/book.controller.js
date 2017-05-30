'use strict';
var Trips 	= 	require('../models/book.model');

exports.allBooking = function(req, res) {
	console.log(req)	
	req.checkBody('id', 'userId is missing').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		return res.status(200).send({
			err:true,
			data:null,
			errText:errors[0].msg
		});
	}else{
		Trips.find({userId:req.params.id},function(err,data) {
			if (err) {
				return res.status('200').json({'err':true,'data':null,errText:"Invalid Request"});
			}else{
				return res.status('200').json({'err':false,data});
			}			
		});
	}		
};

exports.requestRide =  function(req, res) {
	req.checkBody('pickup', 'Please enter Pick Location').notEmpty();
	req.checkBody('drop', 'Please enter Drop Location').notEmpty();
	req.checkBody('phone', 'Please enter Phone').notEmpty();
	req.checkBody('drop_date', 'Please enter Phone').notEmpty();	
	var errors = req.validationErrors();
	if(errors){
		return res.status(200).send({
			err:true,
			data:null,
			errText:errors[0].msg
		});
	}else{
		var book = new Trips();
		book.pickup = req.body.pickup;		
		book.pickId = req.body.pickId;		
		book.dropId = req.body.dropId;	
		book.type = req.body.type;	
		book.userId = req.body.userId;
		book.drop = req.body.drop;
		book.lov = req.body.lov;
		book.phone = req.body.phone;
		book.drop_date = req.body.date;
		book.save(function(err,data) {
			if (err) {
				return res.status('200').json({'err':true,'data':data,errText:"Something wen wrong"});
			}else{
				return res.status('200').json({'err':false,'data':data});
			}			
		});
	}	
};

exports.postComments =  function(req, res) {
	var rating = req.body.rating;		
	var comments = req.body.comments;	
	var _id = req.body._id;				
	if(rating == '' && comments == ''){
		return res.status('200').json({'err':true,'data':null,errText:"Fields are empty"});
	}else{
		Trips.findOneAndUpdate({'_id':_id},{ $set: {'rating':rating,'comments':comments}},
		{"upsert": true},function(err,data) {
	     	if (err) {
				return res.status('200').json({'err':true,'data':null,errText:"Invalid Request"});
			}else{
				return res.status('200').json({'err':false,data});
			}
	   });
	}		
};

exports.authenticate =  function(req, res) {
	console.log("@@@@@@@@@@@@@");
	res.json({"auth":true})
};