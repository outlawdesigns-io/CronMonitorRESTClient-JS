import { createFormData } from '../formData.js';

const resource = '/subscription';

export default function createExecutions(axios){
  return {
    async getAll(){
      const res = await axios.get(`${resource}`);
      return res.data;
    },
    async get(id){
      if(!id){
        throw new Error('Id argument reguired.');
      }
      const res = await axios.get(`${resource}/${id}`);
      return res.data;
    },
    async create(payload){
      const formData = await createFormData();
      Object.keys(payload).forEach((k)=>{ if (payload[k] !== null) formData.append(k,payload[k]) });
      const res = await axios.post(`${resource}`,formData);
      return res.data;
    },
    async update(id,payload){
      const formData = await createFormData();
      Object.keys(payload).forEach((k)=>{ if (payload[k] !== null) formData.append(k,payload[k]) });
      const res = await axios.put(`${resource}/${id}`,formData);
      return res.data;
    },
    async delete(id){
      const res = await axios.delete(`${resource}/${id}`);
      return res.data;
    }
  }
}
