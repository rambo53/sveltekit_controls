<script>
    import Swal from "sweetalert2";
    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    export let lstMethods;


    function removeCheckedInput(cancel){
        Array.from(document.querySelectorAll("#div-methods input:checked")).forEach(input => input.checked = false);
        if(cancel){dispatch("cancel", "")};
    }

    function addArgs(el, need_args){
        console.log(el)
        if(need_args){
            Swal.fire({
                title: 'Arguments de méthode :',
                html:
                '<div class="input-group d-flex justify-content-center">'+
                '<input class="form-control" type="text" id="input-arg">'+
                '</div>',
                showCancelButton: true,
                showConfirmButton: true,
              }).then((result) => {
                console.log(result)
                if (result.isConfirmed) {
                    el.setAttribute('data-args', document.querySelector("#input-arg").value)
                } 
            })
        }
    }

    function registerConfigOnCol(){
        const lstInputChecked = Array.from(document.querySelectorAll("#div-methods input:checked"));
        let method_dict = {};
        if(lstInputChecked.length != 0){
            lstInputChecked.forEach(input => {
                method_dict[input.getAttribute('id')]=input.getAttribute('data-args');
                input.setAttribute('data-args', "");
            })
        }
        removeCheckedInput(false);
        dispatch("method_dict", method_dict);
    }

</script>


    <h3>Méthodes :</h3>
    <div class="mb-3">
    
    {#each lstMethods as method}
    
      <div>
        <input id="{method.method_name}" data-args="" type="checkbox" on:click={(el) => addArgs(el.target, method.need_args)}> 
        <label for="{method.method_name}">{method.public_name}</label>
      </div>
      
    {/each}
    
    </div>

    <button class="btn btn-primary"  on:click={registerConfigOnCol}>enregistrer</button>
    <button class="btn btn-danger" on:click={() => removeCheckedInput(true)}>annuler</button>

