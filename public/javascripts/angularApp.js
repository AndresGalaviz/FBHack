angular.module('galavizNews', ['ui.router'])
.factory('posts', [function(){
  var o = {
  	posts: []
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
}]).controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts){

		$scope.post = posts.posts[$stateParams.id];
}])
.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			})
			.state('posts', {
				url:'/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl'
			});
	$urlRouterProvider.otherwise('home');
}])
