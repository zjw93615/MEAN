angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 
  'mainController', 'authServices', 'blogControllers', 'blogServices', 'ngSanitize', 'CKEditor'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
  });