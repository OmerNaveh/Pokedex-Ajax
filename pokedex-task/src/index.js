//elements
const inputById= document.getElementById('inputById');
const searchByIdButton = document.getElementById('searchByIdButton');
const byIdName = document.getElementById('byIdName')
const byIdHeight = document.getElementById('byIdHeight')
const byIdWeight = document.getElementById('byIdWeight')
const byIdImg = document.getElementById('byIdImg')
const idSearchHeading = document.getElementById('idSearchHeading')
const pokemonDet = document.getElementById('pokemonDet');
const Types = document.getElementById('Types') 

const getPokemonById = async (Id) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${Id}`);
        return response.data;
    } catch (error) {
        errorHandler(error);
        return
    }
}

const changeDomDescById = async (id) =>{
    try {
        const data = await getPokemonById(id);
        inputById.value = '' //reset input value
        byIdName.innerText ='name: ' + data.name;
        byIdHeight.innerText ='height: ' + data.height;
        byIdWeight.innerText = 'weight: ' + data.weight;
        byIdImg.src= data.sprites['front_default'];
        byIdImg.addEventListener('mouseover', (e) => changepostion(data.sprites))
        errorHandler(); //reset this label after change in case of an error
        addPokemonTypes(data.types);
        deleteDropDown();
        deleteReloadBtn();
        return 
    } catch (error) {
        return
    }
}
const changepostion = (data) =>{
    byIdImg.src = data['back_default'];
    byIdImg.addEventListener('mouseout' , () =>{
        byIdImg.src= data['front_default']; })
}
const errorHandler = (error) =>{
    if(error){
        idSearchHeading.innerText = 'This Pokemon does not exist in Pokedex' //in case of an error
        idSearchHeading.style.color = 'red'
        pokemonDet.style.visibility = 'hidden';
    }
    else{
        idSearchHeading.innerText = 'Pokemon Info:' //reset this label after change in case of an error
        idSearchHeading.style.color = 'black';
        pokemonDet.style.visibility = 'visible'
    }
}

const addPokemonTypes = (typesArr) =>{
    deleteExistingTypes(); //delete already created typed to avoid duplication
    for(let type of typesArr){
        const button = document.createElement('button');
        button.innerText= type.type.name;
        button.classList.add('pokeTypes');
        button.addEventListener('click', ()=>{showAllPokemonByType(type.type.name)})
        Types.append(button);
    }
}

const deleteExistingTypes = () =>{
    const buttons = document.getElementsByClassName('pokeTypes');
    for(let button of buttons){
        if(buttons.length>0){
        button.remove()
        deleteExistingTypes(); //recursion because without it the first type always remains
        }
    }
}

const showAllPokemonByType = async (type) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    const allPokemonsRec = response.data.pokemon;
    deleteDropDown();
    const selectElem = createDropDown();
    for(let pokeName of allPokemonsRec ){
        createOption(pokeName.pokemon.name, selectElem);
    }
    selectElem.addEventListener('change', reloadtoNewPokemonOption) //creates reloadPokedex btn on change of selection
}
const createOption = (pokeName , parentElem) =>{
    const optionElem =document.createElement('option');
    optionElem.value = pokeName;
    optionElem.textContent = pokeName;
    parentElem.append(optionElem);
}
const createDropDown = () =>{
    const drpDownTypes = document.createElement('select');
    drpDownTypes.id= 'pokemonNames';
    pokemonDet.append(drpDownTypes);
    return drpDownTypes;
}

const deleteDropDown = () =>{
    try {
        const elem = document.getElementById('pokemonNames');
        elem.remove();
    } catch (error) {
        return
    }
}

const reloadtoNewPokemonOption = () =>{
    try {
        deleteReloadBtn(); //delete existing button if there is one
        const selectedPokemon= document.getElementById('pokemonNames').value
        const newPokemonBtn = document.createElement('button');
        newPokemonBtn.id = 'newPokemonBtn';
        pokemonDet.append(newPokemonBtn);
        newPokemonBtn.textContent = `Find ${selectedPokemon}`;
        newPokemonBtn.addEventListener('click', ()=> {changeDomDescById(selectedPokemon)})
    } catch (error) {
        return
    }
}
const deleteReloadBtn = () =>{
    try {
        const btn= document.getElementById('newPokemonBtn')
        btn.remove();
    } catch (error) {
        return
    }
}
//event listeners
searchByIdButton.addEventListener('click',(e)=> changeDomDescById(inputById.value))
