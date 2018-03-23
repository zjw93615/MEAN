angular.module('blogServices', [])
  .factory('BlogList', function($http) {
    var blogListFactory = {};

    blogListFactory.getBlogList = function(begin, end) {
      return $http.get('/api/blogList/' + begin + '-' + end);
    };
    return blogListFactory;
    
  }).factory('Blog', function($http) {
    var blogFactory = {};

    blogFactory.postBlog = function(blogData) {
      return $http.post('/api/blog', blogData);
    };

    blogFactory.getBlog = function(id) {
      return $http.get('/api/blog?id='+id);
    };

    blogFactory.getUserBlogs = function(username) {
      return $http.get('/api/userblogs?username='+username);
    };


    return blogFactory;
  }).factory('Comment', function($http) {
    var commentFactory = {};

    commentFactory.setCommentThreadId = function(id) {
      commentFactory.commentThreadId = id;
    };

    commentFactory.getCommentThreadId = function() {
      return commentFactory.commentThreadId;
    };

    commentFactory.getComments = function(id) {
      return $http.get('/api/comments?id=' + id);
    };

    commentFactory.postReply = function(postData) {
      return $http.post('/api/comments', postData);
    };

    return commentFactory;
  });