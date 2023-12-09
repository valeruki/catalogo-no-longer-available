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
const plus1 = document.querySelector('#plus1')
const plus2 = document.querySelector('#plus2')

const btnCol1 = document.querySelector('#btnCol1')
const btnCol2 = document.querySelector('#btnCol2')
const btnOrder = document.querySelector('#btnOrder')

const orderList = document.querySelector('.order-list')
const orderlistItems = document.querySelectorAll('.order-list__item')

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
    if (i.group == "Cajas de regalo"){
        plus1.innerHTML = `<p class="filter__item mb-fix" data-id=${i.id}>${i.name}</p>`        
    }
    if (i.group == "Joyas para compartir"){
        plus2.innerHTML = `<p class="filter__item mb-fix" data-id=${i.id}>${i.name}</p>`        
    }
})

// Functions ****************************************************

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
}

const searchInCatalog = () => {
    let getSearch = searchInput.value
    let expression = new RegExp(`${getSearch}.*`, 'i')
    const catalogFiltered = catalog.filter(item => expression.test(item.keywords))     
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

const orderCatalog = (order) => {
    let catalogToOrder =  null
    const url = new URL(window.location.href)    
    let catId = url.searchParams.get('cat')

    if (catId > 0){
        catalogToOrder = catalog.filter(item => item.category == catId)
    }else{
        catalogToOrder = catalog
    }

    let catalogOrdered = catalogToOrder
    if (order == 6){catalogOrdered = catalogToOrder.sort((a, b) => a.id - b.id)}
    if (order == 5){catalogOrdered = catalogToOrder.sort((a, b) => b.id - a.id)}
    if (order == 4){catalogOrdered = catalogToOrder.sort((a, b) => b.title.localeCompare(a.title))}
    if (order == 3){catalogOrdered = catalogToOrder.sort((a, b) => a.title.localeCompare(b.title))}
    if (order == 2){
        catalogOrdered = catalogToOrder.sort((a, b) => {
            let aPrice = a.price.replace(/[\$.,]/g, '')
            let bPrice = b.price.replace(/[\$.,]/g, '')            
            return parseInt(bPrice) - parseInt(aPrice)
        })
    }    
    if (order == 1){
        catalogOrdered = catalogToOrder.sort((a, b) => {
            let aPrice = a.price.replace(/[\$.,]/g, '')
            let bPrice = b.price.replace(/[\$.,]/g, '')            
            return parseInt(aPrice) - parseInt(bPrice)
        })
    }    
    loadCatalog(catalogOrdered)
}

// Listeners *************************************************************

window.addEventListener('DOMContentLoaded', () => {
    catalog.reverse()
    const url = new URL(window.location.href)
    let catId = url.searchParams.get('cat')
    if ( catId> 0){
        filterInCatalog(catId)
    }else{
        loadCatalog(catalog)
    }
})

searchInput.addEventListener('input', () => {
    searchInCatalog()
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
        
        let categorySelected = filterItems[i].getAttribute("data-id")
        
        const url = new URL(window.location.href)
        url.searchParams.set('cat', categorySelected)
        history.pushState({}, '', url)
        
        filterInCatalog(categorySelected)
        filter.classList.add('hidden-outside')
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    })
}

btnCol1.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card')    
    for (let i = 0; i < cards.length; i++){
        cards[i].classList.remove('card-2col')
        cards[i].classList.add('card-1col')
    }
})

btnCol2.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card')    
    for (let i = 0; i < cards.length; i++){
        cards[i].classList.remove('card-1col')
        cards[i].classList.add('card-2col')
    }
})

btnOrder.addEventListener('click', () => {
    orderList.classList.toggle('hidden')
})

for (let i = 0; i < orderlistItems.length; i++){
    orderlistItems[i].addEventListener('click', () => {
        orderList.classList.toggle('hidden')
        orderCatalog(orderlistItems[i].getAttribute('data-order'))
    })
}