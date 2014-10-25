var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Restaurant = mongoose.model('Restaurant');
var Recommendation = mongoose.model('Recommendation');

//POst functions:




router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});




router.get('/init', function(req, res, next) {
  Restaurant.remove({}, function(err) { });
  Recommendation.remove({}, function(err) { });
  var restaurants = []
  console.log("Hey andres")
  
  restaurants.push(new Restaurant({name:'Tacco Monster',
                                   menuItems:[{itemName: 'Quesedilla',price : 50, description:'Con mucho queso'},
                                            {itemName: 'Campechanas',price : 55, description:'Me encanta'},
                                            {itemName: 'Burritos',price : 60, description:'El mejor'},
                                            {itemName: 'Tacos piratas',price : 70, description:'Piratas!!!'},
                                            {itemName: 'Frijoles Charros',price : 40, description:'Hechele!'},
                                            {itemName: 'Papa Asada',price : 80, description:'Con mantequilla'},
                                            {itemName: 'Orden Familiar',price : 110, description:'Carnitas para todos'},
                                            {itemName: 'Salchicha asada',price : 70, description:'Rellena de queso'},
                                            {itemName: 'Soda',price : 18, description:'Bebida'},
                                            {itemName: 'Limonada',price : 20, description:'Toma algo'},
                                            {itemName: 'Gloria',price : 15, description:'Dulcesito'} 
                                   ]
                                  }))
  restaurants[0].save()
 
 
 
 
 
  restaurants.push(new Restaurant({name:'Ming Sushi',
                                  menuItems:[{itemName: 'Salmon',price : 50, description:'Feeling fishy?'},
                                            {itemName: 'Kappa Maki',price : 55, description:'Try new stuff!'},
                                            {itemName: 'Kani',price : 60, description:'Classics never die'},
                                            {itemName: 'Miso Soup',price : 70, description:'Lets add more stuff'},
                                            {itemName: 'Cali Roll',price : 60, description:'The Favorite!'},
                                            {itemName: 'Dragon Roll',price : 75, description:'Ancient taste'},
                                            {itemName: 'Shrimp Roll',price : 90, description:'Who could hate this!'},                            
                                            {itemName: 'Ice cream',price : 70, description:'Dessert, yeah why not'},
                                            {itemName: 'Soy Rice',price : 45, description:'New plate, check it out!'},
                                            {itemName: 'Green Tea',price : 25, description:'Be one with earth.'},
                                   ]                              
 
                                    }))
  restaurants[1].save()
  restaurants.push(new Restaurant({name:'Schnitzelmeister',
                                  menuItems:[{itemName: 'Wiener Schnitzel',price : 50},
                                            {itemName: 'Frankfurter',price : 55},
                                            {itemName: 'Kaiserschmarn',price : 60},
                                            {itemName: 'Gulasch',price : 70}
                                   ]
 
  }))
  restaurants[2].save()
 
  restaurants.push(new Restaurant({name:'Chiky Chicken',
                                  menuItems:[{itemName: 'Chicken',price : 40, description:'You know this well'},
                                            {itemName: 'Biscuit',price : 10, description:'They are cool'},
                                            {itemName: 'Fries',price : 15, description:'Hot and salty'},
                                            {itemName: 'Nuggets',price : 25, description:'Hating bones buddy?'},
                                            {itemName: 'Smashed Potatoe',price : 35, description:'With a secret touch.'},
                                            {itemName: 'Chicken Burger',price : 30, description:'Best invention, bread and chicken!'},
                                            {itemName: 'Special Combo',price : 170, description:'3 Chickens, 3 fries, 3 sodas'},
                                            {itemName: 'Soda',price : 15, description:'Regular or diet'},
                                            {itemName: 'Natural Juice',price : 20, description:'Sugar free'},
                                            {itemName: 'Bottled Water',price : 12}
                                   ]                              
 
                                    }))
  restaurants[3].save()
 
  restaurants.push(new Restaurant({name:'La Fete',
                                  menuItems:[{itemName: 'Green Salad',price : 50, description:'Special of the House'},
                                            {itemName: 'Panini',price : 45, description:'Eat with style'},
                                            {itemName: 'Crepe',price : 60, description:'Sweet or salty'},
                                            {itemName: 'Coffe',price : 25, description:'Just ask how you like it'},
                                            {itemName: 'Warm Chocolate',price : 25, description:'Handmade'}
                                   ]                              
 
                                    }))
  restaurants[4].save()


  
  var rec = new Recommendation({rating: 5,
                      comment: "My Favourite Restaurant!",
                      restaurants: restaurants[0]._id,
                      user: "Batman"})
  rec.save();
  restaurants[0].recommendation.push( rec );

  rec =  new Recommendation({rating: 4,
                      comment: "I like it, but Batman is always there =(!",
                      restaurants: restaurants[0]._id,
                      user: "Superman"})
  
  rec.save();
  restaurants[0].recommendation.push( rec );
  restaurants[0].save()

  res.json(restaurants);

});



router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurants){
    if(err){ return next(err); }

    res.json(restaurants);
  });
});


router.post('/restaurants', function(req, res, next) {
  var restaurant = new Restaurant(req.body);
  console.log(req.body + ', '+ req.body.title)
  restaurant.save(function(err, restaurant){
    if(err){ return next(err); }

    res.json(restaurant);
  });
});




router.param('restaurant', function(req, res, next, id) {
  var query = Restaurant.findById(id);
  query.exec(function (err, restaurant){
    if (err) { return next(err); }
    if (!restaurant) { return next(new Error("can't find restaurant")); }
    req.restaurant = restaurant;
    return next();
  });
});


router.get('/restaurants/:restaurant', function(req, res) {
  req.restaurant.populate('recommendation', function(err, restaurant) {
    res.json(restaurant);
  });
});



router.post('/recommendation', function(req, res, next) {
  var rec = new Recommendation(req.body);
  console.log(req.body + ', '+ req.body.title)
  rec.save(function(err, rec){
    if(err){ return next(err); }

    res.json(rec);
  });
});





/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});






module.exports = router;
