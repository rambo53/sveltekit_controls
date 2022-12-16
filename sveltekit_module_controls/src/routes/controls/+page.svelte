<script>
    import { env as public_env} from '$env/dynamic/public';
    import { goto } from '$app/navigation';
    import {getDataFiles} from './controls.js'

    let dataFilesPromise = getDataFiles();

    let showSelectConfig = false;
    let showDetailsConfig = true;
    $: newConfigMsg = showDetailsConfig == true? "Nouvelle configuration" : "Configurations existantes";

    let lstConfigSelect = [];

    let showErrorMessage = false;
    $: error = showErrorMessage? "": "visually-hidden";

    let disableValidateBtn = true;

    let configSelected = "";

    const showConfig = async (file) => {
        lstConfigSelect = file["configs"];
        showSelectConfig = true;
        showDetailsConfig = true;
        disableValidateBtn = true;

        configSelected = ""
    }

    const showLstConfig = async () => {
        disableValidateBtn = !disableValidateBtn;
        showDetailsConfig = !showDetailsConfig;

        configSelected = ""
    }

    const createNewConfig = async () => {
        const form = document.getElementById('form_new_config');
        let formdata = new FormData(form);
        let id_file = formdata.get("data-file");
        let id_config = formdata.get("config-file");

        if(id_config == null){
            goto("/controls/"+id_file);
        }
        else{
            goto("/controls/"+id_file+"/"+id_config);
        }
    }

    const sendNewFile = async () => {
        const form = document.getElementById('form_new_file');
        let formdata = new FormData(form);

        if(formdata.get("newFile")['name'].trim() != ""){
            showErrorMessage = false;
            
            let r = await fetch(public_env.PUBLIC_URL_API+'data_file/new_file', {method: "POST", body: formdata, 
            headers:{
                "Accept":"application/json"
            }
            });

            if(r.ok === true){
                form.reset();
            }
        }
        else{
            showErrorMessage = true;
        }
    }

</script>

<h1>Controls</h1>

<div>

    <form id="form_new_file" class="col-4" method="post" on:submit|preventDefault={sendNewFile}>
        <div class="mb-3">
            <label for="file" class="form-label">Enregistrer nouveau fichier de données :</label>
            <input type="file" name="newFile" class="form-control" id="file" accept=".csv, .xlsx">
            <span class="text-danger {error}">Vous devez sélectionner un fichier avant de l'envoyer.</span>
        </div>
        <button class="btn btn-primary">Envoyer</button>
    </form>


    <form id="form_new_config" class="mt-5 d-flex justify-content-between" method="post" on:submit|preventDefault={createNewConfig}>
        <div class="col-5">
            <h3>Fichiers existants :</h3>

            {#await dataFilesPromise}
                <h2>Loading....</h2>
            {:then dataFiles}

                {#each dataFiles as file}
                    <div class="form-check mb-4 mt-2">
                        <input class="form-check-input" type="radio" name="data-file" value="{file.id}" on:click={() => showConfig(file)}>
                        <label class="form-check-label d-flex justify-content-between" for="{file.id}">
                        <span>{file.file_name}</span>
                        <span>{file.user_name}</span>
                        </label>
                    </div>
                {/each}

            {:catch error}
                <h2>{error}</h2>
            {/await}

        </div>
 
        <div class="col-5 {showSelectConfig == false? 'visually-hidden':''}">
            <div class="d-flex justify-content-between">
                <div class="btn btn-primary mb-4" on:click={showLstConfig}>{newConfigMsg}</div>
            </div>

            {#if lstConfigSelect.length > 0}
                
                <div class="form-check mb-4 {showDetailsConfig == true? '':'visually-hidden'}">
                    <h3 class="mb-3">Configurations existantes pour ce fichier :</h3>
                    {#each lstConfigSelect as config}

                        <input class="form-check-input" bind:group={configSelected} type="radio" name="config-file" value="{config.id}" on:click={() => {disableValidateBtn = false}}>
                        <label class="form-check-label d-flex justify-content-between" for="{config.id}">
                        <span>{config.name}</span>
                        <span>{config.config_user_create}</span>
                        </label>
                    
                    {/each}
                </div>
            {:else}
                <h4 class="{showDetailsConfig == true? '':'visually-hidden'}">Pas de configurations pour ce fichier.</h4>
            {/if}

            <h4 class="{showDetailsConfig == false? '':'visually-hidden'}">Nouvelle configuration sélectionné.</h4>
            <div class="d-flex justify-content-end">
                <input type="submit" disabled={disableValidateBtn} class="btn btn-primary" value="Valider">
            </div>
        </div>
    </form>
</div>
