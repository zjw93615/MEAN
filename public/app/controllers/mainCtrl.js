angular.module('mainController', ['authServices', 'userServices'])
  .controller('mainCtrl', function(Auth, $location, $timeout, $rootScope, $window, User) {
    var vm = this;

    vm.loadingPage = true;

    $rootScope.$on('$routeChangeStart', function() {
      if(Auth.isLoggedIn()) {
        Auth.getUser().then(function(data) {
          vm.username = data.data.username;
          vm.email = data.data.email;
          $rootScope.username = data.data.username;
          vm.loadingPage = false;
        });
      }else {
        vm.username = null;
        vm.loadingPage = false;
      }
      if($location.hash() == '_=_') $location.hash(null);
      vm.errorMsg = false;
      vm.successMsg = false;
    });

    vm.facebook = function() {
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
    };

    vm.twitter = function() {
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
    };

    vm.getClass = function (path) {
      if(path.length <= 1) {
        return ($location.path() === path) ? 'active' : '';
      }
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    };

    vm.doLogin = function(loginData) {
      vm.loading = true;
      vm.errorMsg = false;
      Auth.login(vm.loginData).then(function(data) {
        if(data.data.success) {
          vm.successMsg = data.data.message;
          vm.loading = false;
          $location.path('/');
          vm.successMsg = null;
          vm.loginData = null;
        }else {
          vm.errorMsg = data.data.message;
          vm.loading = false;
        }
      });
    };

    vm.regUser = function(regData) {
      vm.loading = true;
      vm.errorMsg = false;

      User.create(vm.regData).then(function(data) {
        if(data.data.success) {
          vm.successMsg = data.data.message;
          vm.loading = false;
          $location.path('/');
        }else {
          vm.errorMsg = data.data.message;
          vm.loading = false;
        }
      });
    };

    vm.doLogout = function() {
      Auth.logout();
      $location.path('/logout');
      $timeout(function() {
        $location.path('/');
      }, 2000);
    };

    vm.cleanMsg = function() {
      vm.errorMsg = false;
      vm.successMsg = false;
    };
  });
