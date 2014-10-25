var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Restaurant = mongoose.model('Restaurant');


//POst functions:

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});


router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  console.log(req.body + ', '+ req.body.title)
  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});




router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});


router.get('/posts/:post', function(req, res) {
  res.json(req.post);
});



router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});



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
  var restaurants = []
  console.log("Hey andres")
  restaurants.push(new Restaurant({name:'Tacco Monster',
                                   menuItems:[{itemName: 'Quesedilla',price : 50, description:'Con mucho queso'},
                                            {itemName: 'Campechanas',price : 55, description:'Me encanta'},
                                            {itemName: 'Burritos',price : 60, description:'El mejor'},
                                            {itemName: 'Tacos piratas',price : 70, description:'Piratas!!!'},
                                   ] 
                                  })) 
  restaurants[0].save()
  restaurants.push(new Restaurant({name:'Ming Sushi',
                                  menuItems:[{itemName: 'Salmon',price : 50},
                                            {itemName: 'Kappa Maki',price : 55},
                                            {itemName: 'Kani',price : 60},
                                            {itemName: 'Miso Soup',price : 70},
                                   ]                              

                                    })) 
  restaurants[1].save()
  restaurants.push(new Restaurant({name:'Schnitzelmeister',
                                  menuItems:[{itemName: 'Wiener Schnitzel',price : 50},
                                            {itemName: 'Frankfurter',price : 55},
                                            {itemName: 'Kaiserschmarn',price : 60},
                                            {itemName: 'Gulasch',price : 70},
                                   ]

})) 
  restaurants[2].save()
  
  res.json(restaurants);

});



router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurants){
    if(err){ return next(err); }

    res.json(restaurants);
  });
});


router.post('/reastaurants', function(req, res, next) {
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
  res.json(req.restaurant);
});





/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});






module.exports = router;
