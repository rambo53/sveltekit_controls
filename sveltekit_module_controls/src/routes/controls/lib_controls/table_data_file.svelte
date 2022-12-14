<script>
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

    function addListenerTable(table_html){
        if(!newConfig){addConfigToTable()}

        const lst_th = Array.from(table_html.querySelectorAll("th"));
        lst_th.forEach(th => {
            th.addEventListener('click', event => showAndAddMethods(th, lst_th, table_html));
        });
    }

    function addConfigToTable(){
        dict_cols_to_check = dataFile?.data_file.config.config_dict;

        for(const [key, value] of Object.entries(dict_cols_to_check)){
            var xpath = "//th[text()='"+key+"']";
            var colWithConfig = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            colWithConfig.setAttribute("class", "bg-primary");
        }
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

    function formatConfig(){
        let method;
        let config;

        if(newConfig){
            Swal.fire({
                title: 'Nom de la config :',
                html:
                '<input id="configName" type="text">',
                showCancelButton: true,
                confirmButtonText: 'ok',
            })
            .then((result) => {
            let name = document.querySelector("#configName").value;
            if (result.isConfirmed) { 
                config = {
                    name : name,
                    id_file : dataFile?.data_file.id,
                    config : dict_cols_to_check
                };
                method = "POST";
                postConfig(config, method)
            }
          })
        }
        else{
            config = {
                id_config : dataFile?.data_file.config.id,
                config : dict_cols_to_check
            };
            method = "PATCH";
            postConfig(config, method)
        }
    }

    function postConfig(config, method){

        fetch(public_env.PUBLIC_URL_API+'config/config',{
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
    

    function launchControls(){
        Swal.fire('A faire, voir si enregistrement en même temps ou juste lancement controles')
    }

    function changeDictValue(event){
        console.log(event.detail)

        if(Object.keys(event.detail).length != 0){
            dict_cols_to_check[colName] = event.detail;
            colSelect.setAttribute("class", "bg-primary");
        }
        else{
            delete dict_cols_to_check[colName];
            colSelect.classList.remove("bg-primary");
        }

        showTable();
        console.log(dict_cols_to_check)
    }

    function showTable(){
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
  