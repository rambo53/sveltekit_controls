<script>
	import { goto } from '$app/navigation';
    import { env as public_env} from '$env/dynamic/public';
    import Swal from "sweetalert2";
    import LstMethods from '../lib_controls/lst_methods.svelte';

    export let dataFile;

    let showLstMethods = false;
    $: hideMethods = showLstMethods == false? 'visually-hidden':'';
    let dict_cols_to_check = {};
    let colSelect;
    let colName = "";
    let newConfig = dataFile?.data_file.config? false:true;
    let table_html = null;
    $: table_html_Await = table_html == null? "" : addListenerTable(table_html);
    let showButtonsConfigGlobals = true;
    $: hideButtons = showButtonsConfigGlobals == false? 'visually-hidden':'';


    const addListenerTable = async (table_html) => {
        if(!newConfig){addConfigToTable()}

        const lst_th = Array.from(table_html.querySelectorAll("th"));
        lst_th.forEach(th => {
            th.addEventListener('click', event => showAndAddMethods(th, lst_th, table_html));
        });
    }

    const addConfigToTable = async () => {
        dict_cols_to_check = dataFile?.data_file.config.config_dict;

        for(const [key, value] of Object.entries(dict_cols_to_check)){
            var xpath = "//th[text()='"+key+"']";
            var colWithConfig = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            colWithConfig.setAttribute("class", "bg-primary");
        }
    }

    const showAndAddMethods = async (th, lst_th, table_html) => {
        showButtonsConfigGlobals = !showButtonsConfigGlobals;
        colSelect = th;
        colName = th.innerText;
        const th_index = lst_th.indexOf(th);
        lst_th.forEach(th => {lst_th.indexOf(th) != th_index? th.classList.add("visually-hidden"): ""})
        const lst_tr = Array.from(table_html.querySelectorAll("tbody tr"));
        lst_tr.forEach(tr => {
            let lst_td = Array.from(tr.querySelectorAll("td"))
            lst_td.forEach(td => {lst_td.indexOf(td) != th_index? td.classList.add("visually-hidden"): ""})
        });

        if(colName in dict_cols_to_check){
            const dict_to_check = dict_cols_to_check[colName];
            for(const [key, value] of Object.entries(dict_to_check)){
                document.querySelector("#div-methods input[id="+key+"]").checked = true
            }
        }
        showLstMethods = !showLstMethods;
    }

    function configOk(){
        if(Object.keys(dict_cols_to_check).length == 0){
            Swal.fire("Vous devez renseigner une configuration d'abord.")
            return false;
        }
        return true
    }

    const formatConfig = async () => {

        if(configOk()){
        
            let method;
            let config;
            let endpoint;

            if(newConfig){
                Swal.fire({
                    title: 'Nom de la config :',
                    input: 'text',
                    showCancelButton: true,
                    confirmButtonText: 'ok',
                    preConfirm: (args) =>{
                    try {
                        if(args.trim() == ""){throw new Error("Le nom de la configuration ne peut pas être vide.")}
                        config = {
                            name : args,
                            id_file : dataFile?.data_file.id,
                            config : dict_cols_to_check
                        };
                        method = "POST";
                        endpoint = "new_config"
                        postConfig(config, method,endpoint)
                    } catch (error) {
                        Swal.showValidationMessage(
                            `${error}`
                        )
                    }    
                }
                })
            }
            else{
                config = {
                    id_config : dataFile?.data_file.config.id,
                    config : dict_cols_to_check
                };
                method = "PATCH";
                endpoint = "update_config"
                postConfig(config, method,endpoint)
            }
        }
    }

    const postConfig = async (config, method, endpoint) => {

        fetch(public_env.PUBLIC_URL_API+'config/'+endpoint,{
            method: method,
            body: JSON.stringify(config),
            headers:{
                "Content-type":"application/json; charset=UTF-8",
                "Accept":"application/json"
                }
            }
        )
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if(data.status == 200){
                Swal.fire(data.message)
            }
        })
    }
    

    const launchControls = async () => {
        if(configOk()){
            let data_config = {
                name:dataFile?.data_file.name,
                controls_dict:dict_cols_to_check
            }
            fetch(public_env.PUBLIC_URL_API+'error_file/launch_controls',{
                method: 'POST',
                body: JSON.stringify(data_config),
                headers:{
                    "Content-type":"application/json; charset=UTF-8",
                    "Accept":"application/json"
                    }
                }
            )
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                if(data.status == 200){
                    Swal.fire({
                        title: data.message,
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Voir les erreurs',
                        denyButtonText: `Retourner à l'acceuil`,
                    }).then((result) =>{
                        if(result.isConfirmed){
                            goto("/controls/error_file/"+data.name_file_error)
                        }
                        else if(result.isDenied){
                            goto("/")
                        }
                    })
                }
            })
        }
    }

    const changeDictValue = async (event) => {
        
        if(Object.keys(event.detail).length != 0){
            dict_cols_to_check[colName] = event.detail;
            colSelect.setAttribute("class", "bg-primary");
        }
        else{
            delete dict_cols_to_check[colName];
            colSelect.classList.remove("bg-primary");
        }

        showTable();
    }

    const showTable = async () =>  {
        Array.from(table_html.querySelectorAll("table .visually-hidden")).forEach(el => el.classList.remove("visually-hidden"));
        showButtonsConfigGlobals = !showButtonsConfigGlobals;
        showLstMethods = !showLstMethods;
    }

</script>

<style>
    .table-scroll {
      overflow-x: auto;
      min-width: 20vw;
      height: 100%;
    }
</style>

<div>
    <div id="div-info-file">
        <div class="flex">
          <p>Nom fichier traité : {dataFile?.data_file.name}</p>
          <p>Nombre total de lignes : {dataFile?.data_file.nb_rows}</p>
          <p>Nombre total de colonnes : {dataFile?.data_file.nb_cols}</p>
          <p>Nom configuration : {newConfig == true? "Nouvelle configuration": dataFile?.data_file.config.name}</p>
        </div>
    </div>
</div>

<div class="d-flex justify-content-around">
    <div bind:this={table_html} class="table-scroll">
        {@html dataFile?.data_file.first_rows}
    </div>

    <div id="div-methods" class="{hideMethods}">
        <LstMethods lstMethods = {dataFile?.methods} on:method_dict={changeDictValue} on:cancel={showTable}/>
    </div>

</div>

<div id="div-buttons-config-global" class="mt-5 {hideButtons}">
    
    <button class="btn btn-primary" on:click={formatConfig}>enregistrer config</button> 
    <button class="btn btn-success" on:click={launchControls}>lancer contrôles</button>
    
</div>
  
