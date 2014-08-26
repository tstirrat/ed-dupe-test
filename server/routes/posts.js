var posts = [
  {
    id: '1',
    title: 'Ember Data Embedded Save Test',
    comments: [{ id: '1', body: 'comment 1' }]
  }
];

function findById(id) {
  return posts.reduce(function (result, p) { return p.id === id ? p : null; }, null);
}

var comment_id = 2;


module.exports = function(app) {
  var express = require('express');
  var postsRouter = express.Router();
  postsRouter.get('/', function(req, res) {
    res.send({ posts: posts });
  });

  postsRouter.get('/:id', function(req, res) {
    res.send({ post: findById(req.params.id) });
  });

  postsRouter.put('/:id', function(req, res) {
    var post = req.body.post;
    if (post) {
      post.id = req.params.id;
      post.comments.forEach(function (comment) {
        if (!comment.id) {
          comment.id = (++comment_id) + '';
        }
      });
    }
    res.send({ post: post });
  });

  app.use('/api/posts', postsRouter);
};
