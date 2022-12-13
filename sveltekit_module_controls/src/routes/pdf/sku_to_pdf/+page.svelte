<script>
    import { skuStore } from '../sku_store.js';

    const lstSkuToPdf = $skuStore['lstSkuSelect'];
    let showFormPart = true;

    function showDifferentPartForm(){
        showFormPart = !showFormPart;
    }

</script>

<div class="row align-items-md-stretch mt-5" id="content_jumbotrons">
    <!-- jumbotron product list -->
    <div class="col-md-4">
        <div class="h-100 p-5 bg-light border rounded-3">   
            <h2> {lstSkuToPdf.length} Produit(s) sélectionnés :</h2>
            <br>
            <ul class="list-group list-group-flush">
                {#each lstSkuToPdf as sku} 
                    <li class="list-group-item">{sku}</li>
                {/each}
            </ul>
        </div>
    </div>

    <!-- jumbotron options -->
    <div class="col-md-8 pt-3 ps-5 pe-5 bg-light border rounded-3">
        <form action="" method="POST">
            <div class="{showFormPart==true?"":"visually-hidden"}">
                <h2>Je veux mon export en... </h2>
                <br>
                
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="export_preference" id="radio_multi" value="multi_pdf" checked>
                        <label class="form-check-label" for="radio_multi">plusieurs PDFs</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="export_preference" id="radio_single" value="single_pdf">
                        <label class="form-check-label" for="radio_single">un seul PDF</label>
                    </div>
                    <br>
                    <h2>Options </h2>
                    <br>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                        <label class="form-check-label" for="flexSwitchCheckDefault">L'envoyer par mail</label>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
                        <label class="form-check-label" for="flexSwitchCheckChecked">Option 2</label>
                    </div>
               
                    <div class="d-flex flex-row-reverse mt-5">
                        <div class="btn btn-primary mb-4 rounded-circle" on:click={showDifferentPartForm}><i class="bi bi-caret-right" style="font-size:24px;"></i></div>
                    </div>
                    <!-- <button type="submit" class="btn btn-primary btn-lg" id="sub_button" name="generation">Générer</button> -->
            </div>
            <div class="{showFormPart==true?"visually-hidden":""}">
                <h2>Quel template pour mes pdf :</h2>
                <div class="d-flex">
                    <i class="bi bi-caret-left my-auto" style="font-size:24px;"></i>
                    <div class="card" >
                        <img class="card-img-top" src="" alt="">
                        <div class="card-body">
                          <h5 class="card-title">Akeneo</h5>
                          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                          <a href="" class="btn btn-primary">select</a>
                        </div>
                    </div>
                    <i class="bi bi-caret-right my-auto" style="font-size:24px;"></i>
                </div>
                <div class="d-flex justify-content-between mt-5">
                    <div class="btn btn-primary mb-4 rounded-circle" on:click={showDifferentPartForm}><i class="bi bi-caret-left" style="font-size:24px;"></i></div>
                    <div class="btn btn-primary mb-4 my-auto" id="sub_button" name="generation">Générer</div> 
                </div>

            </div>
        </form>
    </div>
</div>