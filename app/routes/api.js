var User = require('../models/users.js');
var Blog = require('../models/blogs.js');
require('../models/comments.js');
var mongoose = require('mongoose');
var CommentThread = mongoose.model('CommentThread');
var Reply = mongoose.model('Reply');
var jwt = require('jsonwebtoken');
var secret = 'abc';


module.exports = function(router) {
  //http://localhost:8080/api/users
  //User registeration Route
  router.post('/users', function(req,res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
      res.json({success: false, message: 'Ensure username, password, and email were provided.'});
    } else {
      user.save(function(err) {
        if(err) {
          res.json({success: false, message: 'Username or email already exists.'});
        } else {
          res.json({success: true, message: 'User created!'});
        }
      });
    }
  });

  //http://localhost:8080/api/login
  //User Login Route
  router.post('/authenticate', function(req,res){
    User.findOne({username: req.body.username}).select('email username password')
      .exec(function(err,user) {
        if(err) {
          throw err;
        }
        if(!user) {
          res.json({success: false, message: 'Could not authenticate user'});
        }else if(req.body.password){
          var validPassword = user.comparePassword(req.body.password);
          if(!validPassword) {
            res.json({success: false, message: 'Could not authenticate password'});
          }else {
            var token = jwt.sign({
              username: user.username,
              email: user.email
            }, secret, { expiresIn: '24h' });
            res.json({success: true, message: 'User authenticated', token: token});
          }
        }else {
          res.json({success: false, message: 'No password provided'});
        }
      });
  });

  router.post('/me', function(req, res) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if(token) {
      jwt.verify(token, secret, function(err, decoded) {
        if(err) {
          res.json({ success: false, message: 'Token invalid'});
        }else {
          req.decoded = decoded;
          res.send(req.decoded);
        }
      });
    }else {
      res.json({ success: false, message: 'No token provided'});
    }
  });

  router.post('/blog', function(req, res) {
    var blog = new Blog();
    blog.username = req.body.username;
    blog.title = req.body.title;
    blog.summary = req.body.summary;
    blog.body = req.body.body;
    blog.timestamp = req.body.timestamp;
    var comment = new CommentThread({title:'Blog Page Comments'});
    comment.save(function(err, comment){
      if(err) {
        res.json({success: false, message: 'Creat Comment Thread Error'});
      }else {
        blog.commentId = comment.id;
        blog.save(function(err, result) {
          if(err) {
            console.log(err);
            res.json({success: false, message: 'Create Blog Error'});
          }else {
            res.json({success: true, message: result});
          }
        });
      }
    });
  });

  router.get('/blog', function(req, res) {
    Blog.findOne({_id: req.query.id}).exec(function(err,blog) {
      if(err) {
        res.json({success: false, message: 'Mongodb Error'});
      }else {
        res.json({success: true, message: blog});
      }
    });
  });

  router.get('/userblogs', function(req, res) {
    Blog.find({username: req.query.username}).exec(function(err,blog) {
      if(err) {
        res.json({success: false, message: 'Mongodb Error'});
      }else {
        res.json({success: true, message: blog});
      }
    });
  });
  
  router.get('/blogList/:begin-:end', function(req, res) {
    limit = req.params.end - req.params.begin;
    console.log(limit);
    Blog.find({},null,{limit: limit, skip: parseInt(req.params.begin)}).exec(function(err,blogs) {
      if(err) {
        res.json({success: false, message: 'Mongodb Error'});
      }else {
        res.json({success: true, message: blogs});
      }
    });
  });

  router.post('/comments', function(req, res){
    CommentThread.findOne({ _id: req.body.rootCommentId })
      .exec(function(err, comment) {
        if (!comment){
          res.json(404, {msg: 'CommentThread Not Found.'});
        } else {
          var newComment = Reply(req.body.newComment);
          addComment(req, res, comment, comment, 
            req.body.parentCommentId, newComment);
        }
      });
  });

  router.get('/comments', function(req, res) {
    console.log(req.query.id);
    CommentThread.findOne({ _id: req.query.id })
      .exec(function(err, comment) {
        if (!comment){
          res.json({success: false, message: 'CommentThread Not Found.'});
        } else {
          res.json({success: true, message: comment});
        }
      });
  });

  

  return router;
};


var addComment = function(req, res, commentThread, currentComment, parentId, newComment){
  if (commentThread.id == parentId){
    commentThread.replies.push(newComment);
    updateCommentThread(req, res, commentThread);
  } else {
    for(var i=0; i< currentComment.replies.length; i++){
      var c = currentComment.replies[i];
      if (c._id == parentId){
        c.replies.push(newComment);
        var replyThread = commentThread.replies.toObject();
        updateCommentThread(req, res, commentThread);
        break;
      } else {
        addComment(req, res, commentThread, c, 
          parentId, newComment);
      }
    }
  }
};
var updateCommentThread = function(req, res, commentThread){
  CommentThread.findOneAndUpdate(commentThread.id, 
    {$set:{replies:commentThread.replies}}, {new: true})
    .exec(function(err, savedComment){
      if (err){
        res.json({success: false, message: 'Failed to update CommentThread.'});
      } else {
        res.json({success: true, message: savedComment});
      }
    });
};