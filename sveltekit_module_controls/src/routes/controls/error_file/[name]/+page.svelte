<script>
    import { page } from '$app/stores';
    import {getErrors} from './error_file.js'

    let error_promise = getErrors($page.params.name)

</script>

<h1>Df erreur</h1>

{#await error_promise}
loading...
{:then error_table}
    {@html error_table?.error_table}
{:catch error}
    <h2>{error}</h2>
{/await}
