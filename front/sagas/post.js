import axios from 'axios';
import { put, takeLatest, all, fork, throttle, call } from 'redux-saga/effects';

import { ADD_POST_SUCCESS, ADD_POST_FAILURE, ADD_POST_REQUEST,
  ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS,
  REMOVE_POST_FAILURE, REMOVE_POST_SUCCESS, REMOVE_POST_REQUEST,
  LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE, LOAD_POSTS_REQUEST,
  LIKE_POST_REQUEST, UNLIKE_POST_REQUEST,
  LIKE_POST_SUCCESS, LIKE_POST_FAILURE, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,
  RETWEET_SUCCESS, RETWEET_FAILURE, RETWEET_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
  LOAD_POST_REQUEST, LOAD_HASHTAG_POSTS_REQUEST, LOAD_USER_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE, UPDATE_POST_REQUEST, UPDATE_POST_SUCCESS, UPDATE_POST_FAILURE,
} from '../reducers/post';

import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);// formdata는 그대로 넣는다
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data); // 동기
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: RETWEET_FAILURE,
      error: err.name,
    });
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data);// formdata는 그대로 넣는다
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data); // 동기
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.name,
    });
  }
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data); // 동기
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.name,
    });
  }
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data); // 동기
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.name,
    });
  }
}

function addPostAPI(data) {
  return axios.post('/post', data);// formData는 data로 보내야 한다
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data); // 동기
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.name,
    });
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data); // 동기
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.name,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId); // 동기
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.name,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId); // 동기
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.name,
    });
  }
}

function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId); // 동기
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.name,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data); // 동기
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.name,
    });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);// delete는 data 못 넣는다
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data); // 동기
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.name,
    });
  }
}

function updatePostAPI(data) {
  return axios.patch(`/post/${data.PostId}`, data);// delete는 data 못 넣는다
}

function* updatePost(action) {
  try {
    const result = yield call(updatePostAPI, action.data); // 동기
    yield put({
      type: UPDATE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPDATE_POST_FAILURE,
      error: err.name,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function* watchRetweet() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchUpdatePost() {
  yield takeLatest(UPDATE_POST_REQUEST, updatePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchRetweet),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchUpdatePost),
    fork(watchAddComment),
    fork(watchLoadPosts),
    fork(watchLoadPost),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
  ]);
}
