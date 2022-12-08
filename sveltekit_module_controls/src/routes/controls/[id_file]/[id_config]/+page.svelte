<script>
    import { page } from '$app/stores';
    import {getDataFilesAndConfig, getDataFiles} from './config.js';

    let data_file_config_promise = get_data();

    function get_data(){
        if($page.params.id_config == "null"){
            return getDataFiles($page.params.id_file)
        }
        else{
            return getDataFilesAndConfig($page.params.id_file, $page.params.id_config)
        }
    }

    let showLstMethods = false;
    let table_html = null;
    $: table_html_Await = table_html == null? "" : addListenerTable(table_html);

    function addListenerTable(table_html){
        const lst_th = Array.from(table_html.querySelectorAll("th"));
        lst_th.forEach(th => {
            th.addEventListener('click', event => showMethods(th, lst_th, table_html));
        });
    }

    function showMethods(th, lst_th, table_html){
        console.log(th)
        console.log(lst_th.indexOf(th))
        const lst_tr = Array.from(table_html.querySelectorAll("tbody tr"));
        lst_tr.forEach(tr => {
            // get all th and hide those whom index != lst_th.indexOf(th)
        })

        showLstMethods = true;
    }
   
</script>

<style>
    .table-scroll {
      overflow-x: auto;
      min-width: 20vw;
      height: 100%;
    }

    .hide{
        display: none; 
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

<div class="flex">
    <div bind:this={table_html} class="table-scroll">
        {@html dataFile?.data_file.first_rows}
    </div>

    <div class="{showLstMethods == false? 'visually-hidden':''}">
        <h3>Méthodes :</h3>
        <div class="mb-3">
        {#each dataFile?.methods as method}
          <div>
            <input type="checkbox">
            <label for="">{method.public_name}</label>
          </div>
        {/each}
        </div>
        <button class="btn btn-primary">enregistrer</button>
        <button class="btn btn-danger">annuler</button>
    </div>
</div>

{:catch error}
<h2 class="text-danger">{error.message}</h2>
{/await}
