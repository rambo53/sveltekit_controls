import { env as public_env} from '$env/dynamic/public';

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

        return {
            props :{
                data_file: await get_data_file.json(),
                methods: await get_methods.json()
            }
        }
    }	
}