<script>
    import {getDataFiles} from './file.js';
    import { page } from '$app/stores';
    import TableDataFile from '../lib_controls/table_data_file.svelte';

    let dataFilePromise = getDataFiles($page.params.id_file)

</script>

<h1>Manip CSV :</h1>

{#await dataFilePromise}
<h2>Loading...</h2>
{:then data}

<TableDataFile dataFile = {data?.props}/>

{:catch error}
<h2 class="text-danger">{error.message}</h2>
{/await}