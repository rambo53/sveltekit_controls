import { env as public_env} from '$env/dynamic/public';

export async function getDataFilesAndConfig(idFile, id_config) {
    const [get_data_file, get_config, get_methods] = await Promise.all([
      fetch(public_env.PUBLIC_URL_API+'data_file/data_file/'+idFile,{
        method: 'GET',
        headers:{
            "Accept":"application/json"
        }
    }),
      fetch(public_env.PUBLIC_URL_API+'config/config/'+id_config,{
        method: 'GET',
        headers:{
            "Accept":"application/json"
        }
    }),
      fetch(public_env.PUBLIC_URL_API+'method/methods',{
        method: 'GET',
        headers:{
            "Accept":"application/json"
        }
    }),
    ])
    if (get_data_file.ok && get_config.ok && get_methods.ok) {

      return {
          data_file: await get_data_file.json(), 
          config: await get_config.json(),
          methods: await get_methods.json()
      }
    }
  }


export async function getDataFiles(idFile) {
    const [get_data_file, get_methods] = await Promise.all([
        fetch(public_env.PUBLIC_URL_API+'data_file/data_file/'+idFile,{
            method: 'GET',
            headers:{
                "Accept":"application/json"
            }
        }),
        fetch(public_env.PUBLIC_URL_API+'method/methods',{
            method: 'GET',
            headers:{
                "Accept":"application/json"
            }
        }),
    ])
    if(get_data_file.ok && get_methods.ok){
        //let data1 = await get_data_file.json()
        //let data2 = await get_methods.json()
        //console.log(data1)
        //console.log(data2)
        return {
            data_file: await get_data_file.json(),
            methods: await get_methods.json()
        }
    }	
}
