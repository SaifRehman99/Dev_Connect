import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import DisplayComment from './DisplayComment';
import { getPost, CLEAR } from '../../actions/post';

const Post = ({ getPost, CLEAR, match, post: { post, loading } }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link onClick={(e) => CLEAR()} to='/posts' className='btn btn-light'>
        Back to Post
      </Link>
      <PostItem post={post} showActions={false} />

      <CommentForm postID={post._id} />

      {post === null ? (
        <Spinner />
      ) : (
        <Fragment>
          {post.comments.map((comment) => (
            <DisplayComment
              key={comment._id}
              comment={comment}
              postID={post._id}
            />
          ))}
        </Fragment>
      )}
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  CLEAR: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost, CLEAR })(Post);
