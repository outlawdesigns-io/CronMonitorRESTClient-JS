import axios from 'axios';
import authClient from '@outlawdesigns/authenticationclient';
import createJobs from './models/job.js';
import createExecutions from './models/execution.js';
import createSubscriptions from './models/subscription.js';
import createEvents from './models/event.js';

export function createApiClient(baseURL, requestedScope){
  const oauthScope = requestedScope; //the scope(s) for this app
  const oauthResource = baseURL;
  const oauthRefreshBuffer = 300;
  const axiosInstance = axios.create({baseURL:baseURL});
  authClient.onTokenUpdate((token)=>{
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  });
  axiosInstance.interceptors.request.use(async (config)=>{
    const token = authClient.getAccessToken();
    if(!token) throw new Error(`Authenticate before making API calls.`);
    const refreshToken = authClient.getRefreshToken();
    let user;
    if(refreshToken){
      try{
        user = await authClient.verifyAccessToken(token,oauthResource);
      }catch(err){
        console.log(err);
        return;
      }
      const now = Math.floor(Date.now() / 1000);
      const timeDiffSeconds = user.exp - now;
      if(timeDiffSeconds <= oauthRefreshBuffer){
        try{
          await authClient.refreshToken(oauthScope,oauthResource);
        }catch(err){
          console.log(err);
          return;
        }
      }
    }
    config.headers['Authorization'] = `Bearer ${authClient.getAccessToken()}`;
    return config;
  });
  return {
    auth:authClient,
    jobs: createJobs(axiosInstance),
    executions:createExecutions(axiosInstance),
    subscriptions:createSubscriptions(axiosInstance),
    events:createEvents(axiosInstance)
  }
}
