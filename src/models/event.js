const resource = '/event';

export default function createEvents(axios){
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
    }
  }
}
