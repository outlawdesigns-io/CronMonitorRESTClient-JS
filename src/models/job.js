import { createFormData } from '../formData.js';

const resource = '/job';

export default function createJobs(axios){
  return {
    async getAll(){
      const res = await axios.get(`${resource}`);
      return res.data;
    },
    async get(id){
      const res = await axios.get(`${resource}/${id}`);
      return res.data;
    },
    async create(payload){
      const formData = createFormData();
      Object.keys(payload).forEach((k)=>{ if (payload[k] !== null) formData.append(k,payload[k]) });
      const res = await axios.post(`${resource}`,formData);
      return res.data;
    }
  }
}
