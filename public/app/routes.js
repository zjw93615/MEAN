angular.module('appRoutes', ['ngRoute', 'authServices'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'app/views/pages/home.html'
    }).when('/about', {
      templateUrl: 'app/views/pages/about.html'
    }).when('/register', {
      templateUrl: 'app/views/pages/users/login.html'
    }).when('/login', {
      templateUrl: 'app/views/pages/users/login.html',
      resolve: {
        'check':function(Auth, $location){
          if(Auth.isLoggedIn()){
            $location.path('/');    //redirect user to home.
            alert('You have already logged in.');
          }
        }
      }
    }).when('/logout', {
      templateUrl: 'app/views/pages/users/logout.html'
    }).when('/facebook/:token', {
      templateUrl: 'app/views/pages/users/social/social.html',
      controller: 'facebookCtrl',
      controllerAs: 'facebook'
    }).when('/facebookerror', {
      templateUrl: 'app/views/pages/users/login.html',
      controller: 'facebookCtrl',
      controllerAs: 'facebook'
    }).when('/twitter/:token', {
      templateUrl: 'app/views/pages/users/social/social.html',
      controller: 'twitterCtrl',
      controllerAs: 'twitter'
    }).when('/twittererror', {
      templateUrl: 'app/views/pages/users/login.html',
      controller: 'twitterCtrl',
      controllerAs: 'twitter'
    }).when('/blog', {
      templateUrl: 'app/views/pages/blogs/blogList.html'
    }).when('/blog/:day/:month/:year/:title/:id', {
      templateUrl: 'app/views/pages/blogs/blog.html'
    }).when('/addBlog', {
      templateUrl: 'app/views/pages/blogs/addEditBlog.html'
    }).when('/account/:username', {
      templateUrl: 'app/views/pages/account.html'
    }).otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });