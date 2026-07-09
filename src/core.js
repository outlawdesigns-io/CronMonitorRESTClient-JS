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
  let onRefreshCallback;
  authClient.onTokenUpdate((tokenSet)=>{
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokenSet.access_token}`;
    if(onRefreshCallback){
      onRefreshCallback(tokenSet);
    }
  });
  axiosInstance.interceptors.request.use(async (config)=>{
    let token = authClient.getAccessToken();
    if(!token) throw new Error(`Authenticate before making API calls.`);
    let user;
    try{
      user = await authClient.verifyAccessToken(token,[oauthResource]);
    }catch(err){
      if(err.code === "ERR_JWT_EXPIRED"){
        const refreshToken = authClient.getRefreshToken();
        if(refreshToken){
          await authClient.refreshToken(oauthScope,[oauthResource]);
        }else{
          await authClient.clientCredentialFlow(oauthScope,[oauthResource]);
        }
        token = authClient.getAccessToken();
        config.headers['Authorization'] = `Bearer ${token}`;
      }else{
        throw err;
      }
    }
    return config;
  });
  return {
    auth:authClient,
    jobs: createJobs(axiosInstance),
    executions:createExecutions(axiosInstance),
    subscriptions:createSubscriptions(axiosInstance),
    events:createEvents(axiosInstance),
    onRefresh(cb){
      onRefreshCallback = cb;
    }
  }
}
