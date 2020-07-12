import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getPosts } from '../../actions/post';
import PostItem from './PostItem';
import AddPost from './AddPost';

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Post</h1>
          <p className='lead'>
            <i className='fas fa-user'></i> Welcome to the Community
          </p>

          <AddPost />

          <div className='posts'>
            {posts.map((post, index) => (
              <PostItem key={index} post={post} />
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
