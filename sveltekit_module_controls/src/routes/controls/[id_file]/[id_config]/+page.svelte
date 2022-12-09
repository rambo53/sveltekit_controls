<script>
    import { env as public_env} from '$env/dynamic/public';
    import { page } from '$app/stores';
    import {getDataFilesAndConfig, getDataFiles} from './config.js';
    import Swal from "sweetalert2";

    let dict_cols_to_check = {};
    let colSelect;
    let colName = "";
    let showLstMethods = false;
    $: hideMethods = showLstMethods == false? 'visually-hidden':'';
    let showButtonsConfigGlobals = true;
    $: hideButtons = showButtonsConfigGlobals == false? 'visually-hidden':'';
    let table_html = null;
    $: table_html_Await = table_html == null? "" : addListenerTable(table_html);
    let data_file_config_promise = get_data();
    let dataFileId = "";

    data_file_config_promise.then(val => { dataFileId = val?.data_file.id})
    
    function get_data(){
        if($page.params.id_config == "null"){
            return getDataFiles($page.params.id_file)
        }
        else{
            return getDataFilesAndConfig($page.params.id_file, $page.params.id_config)
        }
    }

    function addListenerTable(table_html){
        if($page.params.id_config != "null"){addConfigToTable()}

        const lst_th = Array.from(table_html.querySelectorAll("th"));
        lst_th.forEach(th => {
            th.addEventListener('click', event => showAndAddMethods(th, lst_th, table_html));
        });
    }

    function addConfigToTable(){

        data_file_config_promise.then(data => {
            const config = data.config.config_dict;
            dict_cols_to_check = config;

            for(const [key, value] of Object.entries(config)){
                var xpath = "//th[text()='"+key+"']";
                var colWithConfig = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                console.log(colWithConfig)
                colWithConfig.setAttribute("class", "bg-primary");
            }
        })    
    }

    function showAndAddMethods(th, lst_th, table_html){
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

    function registerConfigOnCol(){
        const lstInputChecked = Array.from(document.querySelectorAll("#div-methods input:checked"));

        if(lstInputChecked.length != 0){
            let method_dict = {};
            lstInputChecked.forEach(input => {
                method_dict[input.getAttribute('id')]=input.getAttribute('data-args');
                input.setAttribute('data-args', "");
            })
            dict_cols_to_check[colName] = method_dict;
            colSelect.setAttribute("class", "bg-primary");
        }
        else{
            delete dict_cols_to_check[colName];
            colSelect.classList.remove("bg-primary");
        }
        
        console.log(dict_cols_to_check)
        showTable();
    }

    function showTable(){
        Array.from(document.querySelectorAll("#div-methods input:checked")).forEach(input => input.checked = false);
        Array.from(table_html.querySelectorAll("table .visually-hidden")).forEach(el => el.classList.remove("visually-hidden"));
        showButtonsConfigGlobals = !showButtonsConfigGlobals;
        showLstMethods = !showLstMethods;
    }

    function addArgs(el, need_args){
        console.log(el)
        if(need_args){
            Swal.fire({
                title: 'Arguments de méthode :',
                html:
                '<div class="input-group d-flex justify-content-center">'+
                '<input class="form-control" type="text" id="input-arg">'+
                '</div>',
                showCancelButton: true,
                showConfirmButton: true,
              }).then((result) => {
                console.log(result)
                if (result.isConfirmed) {
                    el.setAttribute('data-args', document.querySelector("#input-arg").value)
                } 
            })
        }
    }

    const postConfig = async () =>{
        let config;
        let method;

        if($page.params.id_config == "null"){
            config = {
                id_file : dataFileId,
                config : dict_cols_to_check
            };
            method = "POST";
        }
        else{
            config = {
                id_config : $page.params.id_config,
                config : dict_cols_to_check
            };
            method = "PATCH";
        }
      
        const res = await fetch(public_env.PUBLIC_URL_API+'config/config',{
            method: method,
            body: JSON.stringify(config),
            headers:{
                "Content-type":"application/json; charset=UTF-8",
                "Accept":"application/json"
                }
            }
        );
        if(res.ok){
            let data = await res.json();
            Swal.fire(data.message)
        }	
        throw 'Erreur lors du transfert des datas.';
    }

    function launchControls(){
        Swal.fire('A faire, voir si enregistrement en même temps ou juste lancement controles')
    }

</script>

<style>
    .table-scroll {
      overflow-x: auto;
      min-width: 20vw;
      height: 100%;
    }
</style>

<h1>Manip CSV :</h1>
{#await data_file_config_promise}
<h2>Loading...</h2>
{:then dataFile}

<div>
    <div id="div-info-file">
        <div class="flex">
          <p>Nom fichier traité : {dataFile?.data_file.name}</p>
          <p>Nombre total de lignes : {dataFile?.data_file.nb_rows}</p>
          <p>Nombre total de colonnes : {dataFile?.data_file.nb_cols}</p>
          <p>Nom configuration : {$page.params.id_config == "null"? "Nouvelle configuration": dataFile?.config.name}</p>
        </div>
    </div>
</div>

<div class="d-flex justify-content-around">
    <div bind:this={table_html} class="table-scroll">
        {@html dataFile?.data_file.first_rows}
    </div>

    <div id="div-methods" class="{hideMethods}">
        <h3>Méthodes :</h3>
        <div class="mb-3">
        {#each dataFile?.methods as method}
          <div>
            <input id="{method.method_name}" data-args="" type="checkbox" on:click={(el) => addArgs(el.target, method.need_args)}>
            <label for="{method.method_name}">{method.public_name}</label>
          </div>
        {/each}
        </div>

        <button class="btn btn-primary"  on:click={registerConfigOnCol}>enregistrer</button>
        <button class="btn btn-danger" on:click={showTable}>annuler</button>
    </div>
</div>

{:catch error}
<h2 class="text-danger">{error.message}</h2>
{/await}

<div id="div-buttons-config-global" class="mt-5 {hideButtons}">
    <button class="btn btn-primary" on:click={postConfig}>enregistrer config</button>
    <button class="btn btn-success" on:click={launchControls}>lancer contrôles</button>
</div>
