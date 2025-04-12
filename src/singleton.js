import { createApiClient } from './core.js';

let instance = null;

function init(baseURL){
  if(instance){
    if(instance.axios.defaults.baseURL !== baseURL){
      throw new Error(`API client already initialized with ${instance.axios.defaults.baseURL}`);
    }
    return instance;
  }
  instance = createApiClient(baseURL);
  return instance;
}

function getInstance(){
  if(!instance){
    throw new Error('API client not initialized. Call init(baseURL) first.');
  }
  return instance;
}

export default{
  init,
  get: getInstance
};
