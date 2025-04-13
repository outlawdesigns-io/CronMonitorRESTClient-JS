import axios from 'axios';
import authClient from '@outlawdesigns/authenticationclient';
import createJobs from './models/job.js';
import createExecutions from './models/execution.js';
import createSubscriptions from './models/subscription.js';
import createEvents from './models/event.js';

export function createApiClient(baseURL){
  const axiosInstance = axios.create({baseURL:baseURL});
  const auth = authClient;
  auth.onTokenUpdate((token)=>{
    axiosInstance.defaults.headers.common['auth_token'] = token;
  });
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if(error.response && error.response.status === 400 && error.response.data?.includes?.('Invalid Token') && !originalRequest._retry){
        originalRequest._retry = true;
        try{
          const newToken = await authClient.refreshToken();
          axiosInstance.defaults.headers.common['auth_token'] = newToken;
          originalRequest.headers['auth_token'] = newToken;
          return axiosInstance(originalRequest);
        }catch(refreshErr){
          return Promise.reject(refreshErr);
        }
      }
      return Promise.reject(error);
    }
  );
  return {
    auth,
    jobs: createJobs(axiosInstance),
    executions:createExecutions(axiosInstance),
    subscriptions:createSubscriptions(axiosInstance),
    events:createEvents(axiosInstance)
  }
}
