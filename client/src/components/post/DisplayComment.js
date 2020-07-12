import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeComment } from '../../actions/post';

const DisplayComment = ({
  comment: { _id, text, name, avatar, user, date },
  postID,
  auth,
  removeComment,
}) => {
  return (
    <div className='comments'>
      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt='' />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{text}</p>
          <p className='post-date'>
            Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
          </p>

          {!auth.loading && user === auth.user._id && (
            <button
              onClick={(e) => removeComment(postID, _id)}
              type='button'
              className='btn btn-danger'>
              <i className='fas fa-trash'></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

DisplayComment.propTypes = {
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  postID: PropTypes.number.isRequired,
  removeComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { removeComment })(DisplayComment);
