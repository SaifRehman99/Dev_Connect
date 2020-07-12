const router = require('express').Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Add Post
// @access  Private
router.post('/', [auth, check('text', 'Text is Required').not().isEmpty()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // gettng the user data
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    });

    const post = await newPost.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts
// @desc    Get All Post
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get Post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    if (!posts) {
      return res.status(400).json({ msg: 'No Post found' });
    }

    res.json(posts);
  } catch (error) {
    console.log(error.kind);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No profile found' });
    }
    res.status(400).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete Post
// @access  Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    if (!posts) {
      return res.status(400).json({ msg: 'No Post found' });
    }

    if (posts.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized ' });
    }

    await posts.remove();

    res.json({ msg: 'Post Deleted' });
  } catch (error) {
    console.log(error.kind);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No Post found' });
    }
    res.status(400).send('Server Error');
  }
});

// @route   patch api/posts/like/:post_id
// @desc    Like Post
// @access  Private
router.patch('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // If post is already liked
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already Liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route   patch api/posts/unlike/:post_id
// @desc    UnLike Post
// @access  Private
router.patch('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // If post is already unliked
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post already UnLiked' });
    }

    //get Remove like index
    const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route   post api/posts/comment/:post_id
// @desc    Comment on  Post
// @access  Private
router.post('/comment/:post_id', [auth, check('text', 'Text is required').not().isEmpty()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.post_id);
    const user = await User.findById(req.user.id).select('-password');

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    };

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route   delete api/posts/comment/:post_id/:comment_id
// @desc    Delete Comment on Post
// @access  Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    const Postcomment = post.comments.find((comment) => comment.id === req.params.comment_id);

    if (!Postcomment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (Postcomment.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'Not Authorized' });
    }

    //get comment like index
    const removeIndex = post.comments.map((comment) => comment.id.toString()).indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
