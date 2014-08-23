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
      post.comments[1].id = '2';
    }
    res.send({ post: post });
  });

  app.use('/api/posts', postsRouter);
};
