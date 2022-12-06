<script>
    import { env as public_env} from '$env/dynamic/public';
    import {getDataFiles} from './controls.js'

    let dataFilesPromise = getDataFiles();

    let dataFile = "";
    let showSelectConfig = false;
    let showDetailsConfig = true;
    let configSelect = [];

    const showConfig = async (file) => {
        console.log(file);
        configSelect = file["configs"]
        console.log(configSelect)
        showSelectConfig = true;
    }

    const showLstConfig = async () => {showDetailsConfig = !showDetailsConfig;}

    const getFileConfig = async () => {

    }

    const sendNewFile = async () => {
        const form = document.getElementById('form_new_file');
        let formdata = new FormData(form);

        let r = await fetch(public_env.PUBLIC_URL_API+'data_file/data_file', {method: "POST", body: formdata});

        let data = await r.json();
        console.log(data)

        if(r.ok === true){
            form.reset();
        }
    }
</script>

<h1>Controls</h1>

<div>

    <form id="form_new_file" class="col-4" method="post" on:submit|preventDefault={sendNewFile}>
    <div class="mb-3">
        <label for="file" class="form-label">Fichier de données :</label>
        <input type="file" name="newFile" class="form-control" id="file" accept=".csv, .xlsx">
    </div>
    <button class="btn btn-primary">Envoyer</button>
    </form>


    <form class="mt-5 d-flex justify-content-between" method="post" on:submit|preventDefault={getFileConfig}>
        <div class="col-5">
            <h3>Fichiers existants :</h3>

            {#await dataFilesPromise}
                <h2>Loading....</h2>
            {:then dataFiles}

                {#each dataFiles as file}
                    <div class="form-check mb-4 mt-2">
                        <input class="form-check-input" type="radio" bind:group={dataFile} name="data-file" value="{file.id}" on:click={() => showConfig(file)}>
                        <label class="form-check-label d-flex justify-content-between" for="1">
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
                <button class="btn btn-primary mb-4" on:click={showLstConfig}>{showDetailsConfig == true? "Nouvelle configuration" : "Configurations existantes"}</button>
            </div>
            
            {#if configSelect.length != 0}
                
                <div class="form-check mb-4 {showDetailsConfig == true? '':'visually-hidden'}">
                    <h3 class="mb-3">Configurations existantes pour ce fichier :</h3>
                    {#each configSelect as config}
                        <input class="form-check-input" type="radio" name="config" id="1">
                        <label class="form-check-label d-flex justify-content-between" for="1">
                        <span>{config.config_name}</span>
                        <span>{config.config_user_create}</span>
                        </label>
                    {/each}
                </div>
                
            {/if}

            <p class="{showDetailsConfig == false? '':'visually-hidden'}">{dataFile} + nouvelle config</p>
            <div class="d-flex justify-content-end">
                <button class="btn btn-primary">Valider</button>
            </div>
        </div>
    </form>
</div>
