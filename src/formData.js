let FormDataConstructor;

if(typeof window !== 'undefined' && typeof window.FormData !== 'undefined'){
  //Browser
  FormDataConstructor = window.FormData;
}else{
  //Node
  FormDataConstructor = (await import('form-data')).default;
}

export function createFormData(){
  return new FormDataConstructor();
}
