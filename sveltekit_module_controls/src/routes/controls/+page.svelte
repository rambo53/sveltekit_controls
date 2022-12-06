<script>
	import { onMount } from 'svelte';
    import { env as public_env} from '$env/dynamic/public';

    let datas;

    onMount(async () => {
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
            //return res.json();
        }	
	});

    let dataFile = "";
    let showSelectConfig = false;
    let showDetailsConfig = true;

    const showConfig = async () => {showSelectConfig = !showSelectConfig;}
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

            <div class="form-check mb-4 mt-2">
                <input class="form-check-input" type="radio" bind:group={dataFile} name="data-file" id="1" value="Orcab_bain_V1" on:click={showConfig}>
                <label class="form-check-label d-flex justify-content-between" for="1">
                <span>Orcab_bain_V1</span>
                <span>Jacqueline</span>
                <span>01/10/2022</span>
                </label>
            </div>
        </div>

        <div class="col-5 {showSelectConfig == false? 'visually-hidden':''}">
            <div class="d-flex justify-content-between">
                <button class="btn btn-primary mb-4" on:click={showLstConfig}>{showDetailsConfig == true? "Nouvelle configuration" : "Configurations existantes"}</button>
            </div>

            <div class="form-check mb-4 {showDetailsConfig == true? '':'visually-hidden'}">
                <h3 class="mb-3">Configurations existantes pour ce fichier :</h3>
                <input class="form-check-input" type="radio" name="config" id="1">
                <label class="form-check-label d-flex justify-content-between" for="1">
                <span>Orcab_bain_V1</span>
                <span>Jacqueline</span>
                <span>01/10/2022</span>
                </label>
            </div>
            <p class="{showDetailsConfig == false? '':'visually-hidden'}">{dataFile} + nouvelle config</p>
            <div class="d-flex justify-content-end">
                <button class="btn btn-primary">Valider</button>
            </div>
        </div>
    </form>
</div>