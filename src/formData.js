let FormDataConstructor;

export async function createFormData(){
  if(!FormDataConstructor){
    if(typeof window !== 'undefined' && typeof window.FormData !== 'undefined'){
      //Browser
      FormDataConstructor = window.FormData;
    }else{
      //Node
      FormDataConstructor = (await import('form-data')).default;
    }
  }
  return new FormDataConstructor();
}



// export function createFormData(){
//   return new FormDataConstructor();
// }
