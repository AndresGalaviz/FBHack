var mongoose = require('mongoose');
var RestaurantSchema = new mongoose.Schema({
	name: String,
	link: String,
	menuItems: [{itemName: String, price: Number, description: String}],
	upvotes: {type: Number, default: 0},
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
	recommendation: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation'}]
});

RestaurantSchema.methods.upvote = function(cb) {
 	this.upvotes += 1;
 	this.sabe(cb);
}

mongoose.model('Restaurant', RestaurantSchema)