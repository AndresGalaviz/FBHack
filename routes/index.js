var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Restaurant = mongoose.model('Restaurant');

var User = mongoose.model('User');


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
                                   ] 
                                  })) 
  
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

router.get('/signup', function(req, res) {
    res.render('signup', { title: 'Signup' });
});

router.post('/signup', function(req, res) {

  var newUser            = new User();

  // set the user's local credentials
  newUser.local.email    = req.body.email;
  newUser.local.password = newUser.generateHash(req.body.password);
  newUser.save(function(err, user){
    if(err){ return next(err); }

    res.json(user);
  });
  
});

router.get('/login', function(req, res) {
    res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res) {
  User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err){
          console.log("error");
          return;
        }
            

        // if no user is found, return the message
        if (!user){
            console.log("no user");
            return;
        }

  // if the user is found but the password is wrong
        if (!user.validPassword(req.body.password)){
            console.log("invalid password");
            return;
        } 

        console.log("successful");
        // all is well, return successful user
        res.json(user);
        return;
    });
});




/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});







module.exports = router;
