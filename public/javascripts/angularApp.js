angular.module('feedMe', ['ui.router'])
.factory('posts', [function(){
  var o = {
  	posts: []
  };
  return o;
}])
.factory('restaurants', ['$http', function($http){
  	var o = {
  		restaurants: []
  	};

  	o.get = function(id) {
  		return $http.get('/restaurants/' + id).then(function(res){
   			 return res.data;
  		});
	};

	o.getAll = function() {
    return $http.get('/restaurants').success(function(data){
      angular.copy(data, o.restaurants);
    });
  };

  return o;
}])
.controller('MainCtrl', [
	'$scope',
	'posts', 
	function($scope, posts){
		$scope.posts = posts.posts;
		$scope.test  = "Hello world!";

		$scope.addPost = function () {
			console.log($scope.title);
			if(!$scope.title || $scope.title === '') {return;}
			$scope.posts.push({
				title: $scope.title,
				link: $scope.link,
				upvotes: 0,
				comments: [
				    {author: 'Joe', body: 'Cool post!' + $scope.title, upvotes: 0},
				    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
				  ]
			});
			$scope.title='';
			$scope.link='';
		};
		$scope.addComment = function(){
		  if(!$scope.body || $scope.body === '') { return; }
		  $scope.post.comments.push({
		    body: $scope.body,
		    author: 'user',
		    upvotes: 0
		  });
		  $scope.body = '';
		};
		$scope.incrementUpvotes = function(post) {
			post.upvotes +=1;
		}
}]).controller('RestaurantsCtrl', [
	'$scope',
	'restaurants', 
	'restaurantPromise', 
	function($scope, restaurants, restaurantPromise){
		$scope.restaurants = restaurants.restaurants;
		$scope.test  = "Hello world!";

		$scope.addRestaurant = function () {
			console.log($scope.name);
			if(!$scope.name || $scope.name === '') {return;}
			$scope.restaurants.push({
				name: $scope.name,
				link: $scope.link,
				upvotes: 0,
				comments: [
				    {author: 'Joe', body: 'Cool post!' + $scope.name, upvotes: 0},
				    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
				  ]
			});
			$scope.name='';
			$scope.link='';
		};
		$scope.addComment = function(){
		  if(!$scope.body || $scope.body === '') { return; }
		  $scope.restaurants.comments.push({
		    body: $scope.body,
		    author: 'user',
		    upvotes: 0
		  });
		  $scope.body = '';
		};
		$scope.incrementUpvotes = function(restaurants) {
			restaurants.upvotes +=1;
		}
}]).controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts){

		$scope.post = posts.posts[$stateParams.id];
}]).controller('OneRestaurantCtrl', [
	'$scope',
	'$stateParams',
	'restaurantProm',
	function($scope, $stateParams, restaurantProm){
		$scope.code = "welwll2"
		$scope.restaurant = restaurantProm;
		$scope.recommendation = restaurantProm.recommendation;

		$scope.title = "welwll"
		$scope.order = [];
		$scope.order.setOrder = function(cs, count){
			console.log(cs +", count =" +count)
			var ecountered = false;
			for(var i = 0; i< $scope.order.length; i++){
				if(cs === $scope.order[i].item){
					ecountered = true;
					$scope.order[i].amount=count;
				}
			}
			if(!ecountered){
				console.log("not encountered")
			
				$scope.order.push({amount: 1 , item: cs})
			}
		}
		
		$scope.order.getSizeOfOrder = function(cs) {
			console.log("cs")
			var ecountered = false;
			for(var i = 0; i< $scope.order.length; i++){
				if(cs === $scope.order[i].item){
					console.log("true")
					ecountered = true;
					return $scope.order[i].amount;
				}
			}
			if(!ecountered){
				console.log("not true")
				return 0;
			}
		}

		$scope.order.addOrder = function(cs){
			var size = $scope.order.getSizeOfOrder(cs);
			$scope.order.setOrder(cs, size +1);			
		}

		$scope.order.removeOrder = function(cs){
			var size = $scope.order.getSizeOfOrder(cs);
			if(size == 1){
				for(var i = 0; i< $scope.order.length; i++){
					if(cs === $scope.order[i].item){
						$scope.order.splice(i);
					}
				}
			}else if(size >1 )$scope.order.setOrder(cs, size - 1);

		}

		$scope.sum = function(){
			var add = 0;
			for(var i = 0; i< $scope.order.length; i++){
				add += $scope.order[i].item.price*$scope.order[i].amount;
			}
			return add;
		} 
}])
.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			})
			.state('restaurants', {
				resolve: {
 					restaurantPromise: ['restaurants', function(restaurants){
    					return restaurants.getAll();
  					}]
  				},
				url: '/restaurants',
				templateUrl: '/restaurants.html',
				controller: 'RestaurantsCtrl'
			}).state('oneRestaurant', {
				resolve: {
 					restaurantProm: ['$stateParams', 'restaurants', function($stateParams, restaurants) {
    					return restaurants.get($stateParams.id);
  					}]
				},
				url: '/restaurants/{id}',
				templateUrl: '/oneRestaurant.html',
				controller: 'OneRestaurantCtrl'
			})
			.state('posts', {
				url:'/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl'
			});
	$urlRouterProvider.otherwise('restaurants');
}])
