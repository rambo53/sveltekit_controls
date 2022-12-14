<script>
    import TableDataFile from '../../lib_controls/table_data_file.svelte';
    import { page } from '$app/stores';
    import {getDataFilesAndConfig } from './config.js';

    let data_file_config_promise = getDataFilesAndConfig($page.params.id_file, $page.params.id_config)

</script>

<h1>Manip CSV :</h1>

{#await data_file_config_promise}
<h2>Loading...</h2>
{:then data}

<TableDataFile dataFile = {data?.props}/>

{:catch error}
<h2 class="text-danger">{error.message}</h2>
{/await}