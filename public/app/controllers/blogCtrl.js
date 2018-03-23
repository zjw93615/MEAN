angular.module('blogControllers', ['blogServices', 'ngSanitize'])
  .controller('blogCtrl', function($http, $location, BlogList, Blog, Comment, $rootScope, $routeParams) {
    var vm = this;
    vm.blogs = false;
    vm.submitting = false;
    vm.blogData = false;
    vm.isme = false;

    vm.getBlog = function() {
      var param = $routeParams.id;
      Blog.getBlog(param).then(function(data) {
        vm.blogData = data.data.message;
        Comment.getComments(vm.blogData.commentId).then(function(data) {
          vm.commentsData = data.data.message;
        });
      });
    };

    vm.getBlogList = function(begin, end) {
      BlogList.getBlogList(begin, end).then(function(data) {
        vm.blogs = data.data.message;
        for (var i in vm.blogs) {
          var date = new Date(vm.blogs[i].timestamp);
          vm.blogs[i].day = date.getDate();
          vm.blogs[i].month = date.getMonth();
          vm.blogs[i].year = date.getFullYear();
        }
      });
    };

    vm.postBlog = function(blogData) {
      vm.submitting = true;
      blogData.username = $rootScope.username;
      blogData.timestamp = new Date();
      Blog.postBlog(blogData).then(function(data) {
        vm.submitting = false;
        var date = new Date(data.data.message.timestamp);
        $location.path('/blog/'+date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()+'/'+data.data.message.title+'/'+data.data.message._id);
      });
    };

    vm.addReply = function(commentId, replySubject, replyBody) {
      var postData = {};
      postData.rootCommentId = vm.blogData.commentId;
      postData.parentCommentId = commentId;
      var newComment = {};
      newComment.username = $rootScope.username;
      newComment.subject = replySubject;
      newComment.body = replyBody;
      postData.newComment = newComment;
      Comment.postReply(postData).then(function(data) {
        console.log(data.data);
        vm.commentsData = data.data.message;
        replySubject = '';
        replyBody = '';
      });
    };

    vm.getUserBlogs = function() {
      vm.isme = false;
      if($rootScope.username != null && $rootScope.username == $routeParams.username) {
        vm.isme = true;
      }
      Blog.getUserBlogs($routeParams.username).then(function(data) {
        vm.userblogs = data.data.message;
      });
    };
  });