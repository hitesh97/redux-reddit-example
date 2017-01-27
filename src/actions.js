import fetch from 'isomorphic-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_REDDIT = 'SELECT_REDDIT';
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT';

export const REQUEST_WEATHER = 'REQUEST_WEATHER';
export const RECEIVED_WEATHER_DATA = 'RECEIVED_WEATHER_DATA';

export function selectReddit(reddit) {
  return {
    type: SELECT_REDDIT,
    reddit
  };
}

export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  };
}

function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  };
}

function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit));
    return fetch(`http://www.reddit.com/r/${reddit}.json`)
      .then(req => req.json())
      .then(json => dispatch(receivePosts(reddit, json)));
  }
}

function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit];
  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit));
    }
  }
}


function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  };
}

function processData(cityName, json) {
  var receivedWeatherObj = {
    type: RECEIVED_WEATHER_DATA,
    cityName,
    weather: json.weather.map(child => child),
    receivedAt: Date.now()
  };
  console.log(receivedWeatherObj)
  return receivedWeatherObj;
}

function getWeather(cityName) {
  return dispatch => {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=51e1e3bda8354dbec4eb86918ccd4e8c`)
      .then(req => req.json())
      .then(json => dispatch(processData(cityName, json)));
  }
}

export function fetchWeather(cityName){
  return (dispatch, getState) => {
    return dispatch(getWeather(cityName));
  }
}
