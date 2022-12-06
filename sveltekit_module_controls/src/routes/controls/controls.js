import { env as public_env} from '$env/dynamic/public';

export async function getDataFiles(){
    const res = await fetch(public_env.PUBLIC_URL_API+'data_file/data_files',{
            method: 'GET',
            headers:{
                "Accept":"application/json"
            }
        }
    );
    if(res.ok === true){
        //datas = await res.json();
        let data = res.json();
        console.log(data)
        return data;
        //return res.json();
    }	
    else{
        throw 'Erreur lors du chargement des datas.';
    } 
};