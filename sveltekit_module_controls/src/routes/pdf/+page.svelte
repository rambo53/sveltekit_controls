<script>
    import { getProducts } from './pdf.js';
    import { env as public_env} from '$env/dynamic/public';
    import { goto } from '$app/navigation';
    import { skuStore } from './sku_store.js';

    let productsPromise = getProducts(); 
    let errorMessage = false;
    let lstSkuSelect = [];
    let lstSkuSelectLength = lstSkuSelect.length;
    $: hideBtnPdf = lstSkuSelectLength ==0?true:false;
    $: lstSkuPdf = lstSkuSelect;

    const searchProducts = async () => {
        const form = document.getElementById('form_search_products');
        const formdata = new FormData(form);
        const valueToSearch = String(formdata.get("product"))

        if(valueToSearch.trim() == ""){
            errorMessage = true;
        }
        else{
            errorMessage = false;
            const res = await fetch(public_env.PUBLIC_URL_API+'data_from_akeneo/get_products/'+valueToSearch,{
                method: 'GET',
                headers:{
                    "Accept":"application/json"
                }
            })
            if(res.ok){
                productsPromise = await res.json();
            }
        }
    }

    function addTolistForPdf(skuToAdd){
        const sku = skuToAdd.getAttribute("value");

        if(!lstSkuSelect.includes(sku)){
            lstSkuSelect.push(sku);
        }
        else{
            const indexSku = lstSkuSelect.indexOf(sku);
            lstSkuSelect.splice(indexSku, 1);
        }
        lstSkuSelectLength = lstSkuSelect.length;
        lstSkuPdf = lstSkuSelect;
    }

    function removeSku(){
        lstSkuSelect = []
        lstSkuSelectLength = 0
        document.querySelectorAll("#table-body input:checked").forEach(input => {
            input.checked = false;
        })
    }

    function skuSelected(lstSkuSelect){
        skuStore.update(() => lstSkuSelect)
        goto("/pdf/sku_to_pdf")
    }

</script>

<h1>
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
        <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.701 19.701 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.716 5.716 0 0 1-.911-.95 11.642 11.642 0 0 0-1.997.406 11.311 11.311 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.27.27 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.647 12.647 0 0 1 1.01-.193 11.666 11.666 0 0 1-.51-.858 20.741 20.741 0 0 1-.5 1.05zm2.446.45c.15.162.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.881 3.881 0 0 0-.612-.053zM8.078 5.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
    </svg>
    Export vers PDF
</h1>

<form method="GET" id="form_search_products" class="form-export" on:submit|preventDefault={searchProducts}>
    <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Id, nom, famille, status, etc..." name="product">
        <button type="submit" class="btn btn-primary btn">
            <i class="bi bi-search" style="color: white;"></i>
        </button>
    </div>
</form>

{#if errorMessage}<span class="text-danger">Vous devez rentrer une valeur ?? rechercher.</span>{/if}

<form action="" method="GET" class="form-export">
    <div class="input-group mb-3">
        <input type="submit" class="btn btn-secondary btn" value="R??initialiser" name="reset"/>
    </div>
</form>
<hr>
<div>
    <h2>50 r??sultats</h2>
    <br>
</div>
<button class="btn btn-primary btn" name="refresh_products" title="Rafraichir le tableau" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    <i class="bi bi-arrow-counterclockwise" style="color: white;"></i>
</button>
<div class="body d-flex justify-content-around">
    <!-- Filterable table -->
    <div>
        <table id="products-table m-0" class="tablesorter table table-hover table-striped">
        <thead id="table-head">
            <tr>
                <th><input type="checkbox" name="select_all" id="select_all" value="value"></th>
                <th>SKU</th>
                <th>Nom</th>
                <th>Famille</th>
                <th>Status</th>
                <th>Date cr??ation</th>
                <th>Derniere MAJ</th>
                <th>Parent</th>
            </tr>
        </thead>
        <tbody id="table-body">
            {#await productsPromise}
                <h2>Loading...</h2>
            {:then products}
                {#each products?.products as product} 
                    <tr>
                        <td><input type="checkbox" name="product" class="checkboxes" value="{product.identifier}" on:click={(event) => addTolistForPdf(event.target)}></td>
                        <td>{product.identifier}</td>
                        <td>{product.name}</td>
                        <td>{product.family}</td>
                        <td>{product.enabled}</td>
                        <td>{product.created}</td>
                        <td>{product.updated}</td>
                        <td>{product.parent}</td>
                    </tr>
                {/each}
            {:catch error}
                <h2 class="text-danger">{error.message}</h2>
            {/await}        
        </tbody>
    </table>
    </div>
    
    <!-- Cart -->
    <div class="card border-primary" style="width: 20%;">
        <div>
            <div class="card-header d-flex justify-content-around flex-wrap align-items-center">
                <div>
                    S??lection -
                    <span id="nb_cart_item">{lstSkuSelectLength}</span>
                </div>
                
                <div class="d-flex mx-2">
                    <button type="button" disabled={hideBtnPdf} class="btn btn-inverse btn-danger btn-sm mx-1" id="clear_button" data-bs-toggle="tooltip" data-bs-placement="top" title="Supprimer la s??lection" on:click={removeSku}>
                        <i class="bi bi-trash"></i>
                    </button>
                    <button type="button" disabled={hideBtnPdf}  class="btn btn-inverse btn-success btn-sm mx-1" id="gen_button" data-bs-toggle="tooltip" data-bs-placement="top" title="Valider la s??lection" on:click={() => skuSelected({lstSkuSelect})}>
                        <i class="bi bi-check-lg"></i>
                    </button>
                </div>
            </div>
            <div class="card-body text-center">
                <ul id="cart_list" class="list-group list-group-flush">
                    {#each lstSkuPdf as sku} 
                        <li class="list-unstyled">{sku}</li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>
