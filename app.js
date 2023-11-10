// Elements ****************************************************

const main = document.querySelector('.main')
const cardTemplate = document.querySelector('#cardTemplate').content
let fragment = document.createDocumentFragment()
const searchInput = document.querySelector('#searchInput')
const autoComplete = document.querySelector('.autocomplete')
const filtersBtn = document.querySelector('#filtersBtn')
const filter = document.querySelector('.filter')
const closeFilterBtn = document.querySelector('#closeFilterBtn')

const filterGroupDama = document.querySelector('#groupDama')
const filterGroupCaballero = document.querySelector('#groupCaballero')
const filterGroupInfantil = document.querySelector('#groupInfantil')

// load filter options ********************************************

categories.map((i) => { 
    if (i.group == "Dama"){
        filterGroupDama.innerHTML += `<p class="filter__item" data-id=${i.id}>${i.name}</p>`        
    }
    if (i.group == "Caballero"){
        filterGroupCaballero.innerHTML += `<p class="filter__item" data-id=${i.id}>${i.name}</p>`        
    }
    if (i.group == "Infantil"){
        filterGroupInfantil.innerHTML += `<p class="filter__item" data-id=${i.id}>${i.name}</p>`        
    }   
})

// Functions ****************************************************

const enableShower = () => {
    const cardShower = document.querySelectorAll('.card__shower')
    for (let i = 0; i < cardShower.length; i++){
        cardShower[i].addEventListener('click', () => {
            cardShower[i].previousElementSibling.classList.toggle('hidden')
            cardShower[i].childNodes[1].classList.toggle('shower-indicator')
        })
    }
}

const loadCatalog = (data) => {
    main.innerHTML = ''
    for (let i = 0; i < data.length; i++){        
        let cloneTemplate = cardTemplate.cloneNode(true)
        
        for (let j = 0; j < data[i].image.length; j++){
            cloneTemplate.querySelector('.card__img__container').innerHTML += `<img loading="lazy" class="card__img" src="./images/${data[i].image[j]}" alt="VALERUKI">`
        }
        
        cloneTemplate.querySelector('.card').setAttribute('href', `https://valeruki.github.io/catalogo/item.html?id=${data[i].id}`)
        cloneTemplate.querySelector('.card__title').textContent =  data[i].title
        cloneTemplate.querySelector('.card__main-info__cat').textContent = categories.filter(c => c.id == data[i].category)[0].name 
        cloneTemplate.querySelector('.card__main-info__price').textContent = data[i].price        
        fragment.appendChild(cloneTemplate)
    }
    
    if (data.length == 0){
        main.innerHTML = `<h3 class='info'>Sin resultados</h3>`
    }else{
        main.appendChild(fragment)
    }    
    //enableShower()
}

const searchInCatalog = () => {
    let getSearch = searchInput.value
    let expression = new RegExp(`${getSearch}.*`, 'i')
    const catalogFiltered = catalog.filter(item => expression.test(item.title))     
    loadCatalog(catalogFiltered)
}

const filterInCatalog = (selected) => {
    if (selected == '0'){
        loadCatalog(catalog)
    }else{        
        const catalogFiltered = catalog.filter(item => item.category == selected)     
        loadCatalog(catalogFiltered)
    }    
}

// Listeners *************************************************************

window.addEventListener('DOMContentLoaded', () => {
    catalog.reverse()
    loadCatalog(catalog)
})

searchInput.addEventListener('input', () => {
    searchInCatalog(catalog)
})

filtersBtn.addEventListener('click', () => {
    filter.classList.toggle('hidden-outside')
})

closeFilterBtn.addEventListener('click', () => {
    filter.classList.toggle('hidden-outside')
})

const filterItems = document.querySelectorAll('.filter__item')
for (let i = 0; i < filterItems.length; i++){
    filterItems[i].addEventListener('click', () => {
        filterInCatalog(filterItems[i].getAttribute("data-id"))
        filter.classList.add('hidden-outside')
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    })
}