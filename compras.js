const cartas = document.getElementById('cards_contain'); // es donde se va a imprimir
const templateCards = document.getElementById('cards_template').content; // es lo que se va a imprimir

const lineasTabla = document.getElementById('car_table_print');
const templateCar = document.getElementById('car_template').content;

const lineaPrecio = document.getElementById('price_table_print');
const templatePrice = document.getElementById('price_template').content;

const fragment = document.createDocumentFragment();
let carrito= {};    

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if(localStorage.getItem('carBuy')){
        carrito = JSON.parse(localStorage.getItem('carBuy'));
        printCar();
    }
});
 
cartas.addEventListener('click', e => {
    addCarrito(e);
});

lineasTabla.addEventListener('click', e => {
    action_buttons(e);
});

const fetchData = async() => {
    try{
        const docJson = await fetch('compras.json');
        const data = await docJson.json();        
        printCards(data);
    }
    catch (error){
        console.log(error + 'Estoy en este error');
    }
}

const printCards = product => {
    product.forEach(item =>{
        templateCards.querySelector('h5').textContent = item.title;
        templateCards.querySelector('p').textContent = item.precio;
        templateCards.querySelector('img').setAttribute("src", item.thumbnailUrl);
        templateCards.querySelector('button').dataset.id = item.id;
        
        const clone = templateCards.cloneNode(true);
        fragment.appendChild(clone);
    })
    cartas.appendChild(fragment);
};

const addCarrito = e =>{
    if(e.target.classList.contains('button_card')){
        infoCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

const infoCarrito = articulo =>{
    const compra = {
        id: articulo.querySelector('.button_card').dataset.id,
        title: articulo.querySelector('h5').textContent,
        precio: articulo.querySelector('p').textContent,
        cantidad: 1
    }
    
    if(carrito.hasOwnProperty(compra.id)){
        compra.cantidad = carrito[compra.id].cantidad + 1;
    }

    carrito[compra.id] = {...compra}

    printCar();
}

const printCar = () =>{

    lineasTabla.innerHTML = '';

    Object.values(carrito).forEach(linea => {
        templateCar.querySelector('.th_car').textContent = linea.id;
        templateCar.querySelectorAll('td')[0].textContent = linea.title;
        templateCar.querySelectorAll('td')[1].textContent = linea.cantidad;
        templateCar.querySelector('.btn-info').dataset.id = linea.id;
        templateCar.querySelector('.btn-danger').dataset.id = linea.id;
        templateCar.querySelector('span').textContent = linea.cantidad * linea.precio

        const clone = templateCar.cloneNode(true);
        fragment.appendChild(clone);
    })
    lineasTabla.appendChild(fragment);

    printPrice();

    localStorage.setItem('carBuy',JSON.stringify(carrito));
    
}

const printPrice = () => {

    lineaPrecio.innerHTML = ' ';

    if (Object.keys(carrito).length === 0){
        lineaPrecio.innerHTML = 
        `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    };

    const totalCantidad = Object.values(carrito).reduce( (acc, {cantidad}) => acc + cantidad ,0);
    const totalPrecio = Object.values(carrito).reduce( (acc, {cantidad, precio}) => acc + cantidad * precio ,0);

    templatePrice.querySelectorAll('td')[0].textContent = totalCantidad;
    templatePrice.querySelector('span').textContent = totalPrecio;

    const clone = templatePrice.cloneNode(true);

    fragment.appendChild(clone);

    lineaPrecio.appendChild(fragment);

    var button = document.querySelector('#empty_car');
    button.addEventListener('click', ()=>{
        carrito = {};
        printCar();
    });

};

const action_buttons = e => {
    
    if(e.target.classList.contains('btn-info')){
        
        const product = carrito[e.target.dataset.id];
        product.cantidad++;
        carrito[e.target.dataset.id] = {...product}
        printCar();
    }

    if(e.target.classList.contains('btn-danger')){
        const product = carrito[e.target.dataset.id];
        product.cantidad--;
        
        if(product.cantidad === 0){
            delete carrito[e.target.dataset.id];
        }
 
        printCar();
    }

    e.stopPropagation();
}