angular.module('userControllers', ['userServices'])
  .controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
    var vm = this;
    if($window.location.pathname == '/facebookerror') {
      vm.errorMsg = 'Facebook Login Error.';
    }else {
      //do something
      Auth.socialLogin($routeParams.token);
      $location.path('/');
    }
  }).controller('twitterCtrl', function($routeParams, Auth, $location, $window) {
    var vm = this;
    if($window.location.pathname == '/twittererror') {
      vm.errorMsg = 'Twitter Login Error.';
    }else {
      //do something
      Auth.socialLogin($routeParams.token);
      $location.path('/');
    }
  });