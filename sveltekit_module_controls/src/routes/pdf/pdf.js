import { env as public_env} from '$env/dynamic/public';

export async function getProducts(){
    const res = await fetch(public_env.PUBLIC_URL_API+'data_from_akeneo/get_first_rows',{
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