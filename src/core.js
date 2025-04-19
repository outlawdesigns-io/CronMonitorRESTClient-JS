import axios from 'axios';
import authClient from '@outlawdesigns/authenticationclient';
import createJobs from './models/job.js';
import createExecutions from './models/execution.js';
import createSubscriptions from './models/subscription.js';
import createEvents from './models/event.js';

export function createApiClient(baseURL){
  const axiosInstance = axios.create({baseURL:baseURL});
  const _auth = authClient;
  let _credentials = {username:null,password:null};
  _auth.onTokenUpdate((token)=>{
    axiosInstance.defaults.headers.common['auth_token'] = token;
  });
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      //use of bad token. Refresh it and try again.
      if(error.response && error.response.status === 400 && error.response.data?.includes?.('Invalid Token') && !originalRequest._retry){
        originalRequest._retry = true;
        try{
          const newToken = (_credentials.username === null || _credentials.password === null) ? await _auth.refreshToken() : await _auth.refreshToken(_credentials.username,_credentials.password);
          axiosInstance.defaults.headers.common['auth_token'] = newToken;
          originalRequest.headers['auth_token'] = newToken;
          return axiosInstance(originalRequest);
        }catch(refreshErr){
          return Promise.reject(refreshErr);
        }
      }
      if(error?.response?.data){
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    }
  );
  axiosInstance.interceptors.request.use((config)=>{
    if(!_auth.getAuthToken()){
      throw new Error('authenticate or provide an auth_token to make API calls.');
    }
    return config;
  },(err)=>{
    return Promise.reject(err);
  });
  return {
    auth:_auth,
    setCredentials:function(username,password){
      _credentials.username = username;
      _credentials.password = password;
    },
    jobs: createJobs(axiosInstance),
    executions:createExecutions(axiosInstance),
    subscriptions:createSubscriptions(axiosInstance),
    events:createEvents(axiosInstance)
  }
}
