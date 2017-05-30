var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BookingSchema = Schema({
	pickup:{type: String,required: true },
	drop: {type: String,required: true },	
	pickId:{type: String,required: true },
	dropId: {type: String,required: true },	
	type:{type:String,required:true},
	comments:{type:String,default:null},
	lov:{type:String,required: true,default:"none"},
	rating:{type:Number,default:0},
	phone:{ type: Number , required: true},
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	booked_at: { type: String, required: true, default: Date.now },
	drop_date:{type:String,required:true, default: Date.now }
	},{ versionKey: false
});

module.exports = mongoose.model('bookdetails', BookingSchema);