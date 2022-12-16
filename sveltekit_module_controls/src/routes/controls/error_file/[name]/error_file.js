import { env as public_env} from '$env/dynamic/public';

export async function getErrors(path){
    const res = await fetch(public_env.PUBLIC_URL_API+'error_file/'+path,{
            method: 'GET',
            headers:{
                "Accept":"application/json"
            }
        }
    );
    if(res.ok){
        let data = res.json();
        console.log(data)
        return data;
    }	
    else{
        throw 'Erreur lors du chargement des datas.';
    } 
};