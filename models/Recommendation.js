var mongoose = require('mongoose');
var RecommendationSchema = new mongoose.Schema({
	rating: Number,
	comment: String,
	restaurants: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurants'},
	user: String
});

mongoose.model('Recommendation', RecommendationSchema)