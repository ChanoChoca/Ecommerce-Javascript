import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAWSB8cvVnoRkeWo6i9PMrUeYf3TxLSb0Q",
    authDomain: "javascript-app-c1c1d.firebaseapp.com",
    projectId: "javascript-app-c1c1d",
    storageBucket: "javascript-app-c1c1d.appspot.com",
    messagingSenderId: "831058231435",
    appId: "1:831058231435:web:69dc0c56911c371952d48e"
};

// Inicializar Firebase
const api = initializeApp(firebaseConfig);
const db = getFirestore(api);

// ***** SE CAMBIAN FONTS *****
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = 'https://fonts.googleapis.com/css?family=Roboto&display=swap';
document.head.appendChild(linkElement);

const elementos = document.querySelectorAll('p, h1, h2, label, option');
elementos.forEach((elemento) => {
    elemento.style.fontFamily = 'Roboto, sans-serif';
});

// ***** PRIMER MÉTODO (CARGA DE PRODUCTOS) *****

class Producto {
    constructor(id, name, type, price, stock, description, image) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;
        this.stock = stock;
        this.description = description;
        this.image = image;
    }
}

const productosBase = [
    {id:"0", name:"VK 72.01 (K)", type:"Tanque", price:650, stock:1000, description:"Tanque pesado alemán de recompensa de nivel X", image: "https://tanks.gg/img/tanks/germany-G92_VK7201.png"},
    {id:"1", name:"T95/FV4201 Chieftain", type:"Tanque", price:650, stock:1000, description:"Tanque pesado británico de recompensa de nivel X", image: "https://tanks.gg/img/tanks/uk-GB98_T95_FV4201_Chieftain.png"},
    {id:"2", name:"Object 260", type:"Tanque", price:650, stock:1000, description:"Tanque pesado soviético de recompensa de nivel X", image: "https://tanks.gg/img/tanks/ussr-R110_Object_260.png"},
    {id:"3", name:"Object 907", type:"Tanque", price:650, stock:1000, description:"Tanque medio soviético de recompensa de nivel X", image: "https://tanks.gg/img/tanks/ussr-R95_Object_907.png"},
    {id:"4", name:"Object 279 early", type:"Tanque", price:650, stock:1000, description:"Tanque pesado soviético de recompensa de nivel X", image: "https://tanks.gg/img/tanks/ussr-R157_Object_279R.png"},
    {id:"5", name:"WN8", type:"MejoraDeCuenta", price:12.94, stock:null, description:"12.94 USD * 10 batallas", image: "https://www.overtank.com/image/thumbnails/18/ff/wn8b_png-102392-380x380.png"},
    {id:"6", name:"Créditos y Experiencia", type:"MejoraDeCuenta", price:8.82, stock:null, description:"8.82 USD * (1M créditos + 30K experiencia)", image: "https://www.overtank.com/image/thumbnails/19/fd/silver_7_overtank_png-106455-380x380.png"},
    {id:"7", name:"Créditos", type:"MejoraDeCuenta", price:5.95, stock:null, description:"5.95 USD * 1M créditos", image: "https://www.overtank.com/image/thumbnails/18/fb/silver_normal_png_100455_380x380_png-102335-250x250.png"},
    {id:"8", name:"Experiencia", type:"MejoraDeCuenta", price:9.44, stock:null, description:"9.44 USD * 50K experiencia", image: "https://www.overtank.com/image/thumbnails/18/fc/anyxp_silver_png_100491_380x380_png-102336-250x250.png"},
    {id:"9", name:"Bonos", type:"MejoraDeCuenta", price:16.96, stock:null, description:"16.96 USD * 100 bonos", image: "https://www.overtank.com/image/thumbnails/18/fb/bonds_png-102334-250x250.png"}
]

const productos = JSON.parse(localStorage.getItem("productos")) || []

const agregarProducto = ({id, name, type, price, stock, description, image}) => {
    if (!productos.some(prod => prod.id === id)) {
        const productoNuevo = new Producto(id, name, type, price, stock, description, image)
        productos.push(productoNuevo)
        localStorage.setItem('productos', JSON.stringify(productos))
    }
}

const productosPreexistentes = () => {
    if (productos.length === 0) {
        productosBase.forEach(producto => {
            let dato = JSON.parse(JSON.stringify(producto))
            agregarProducto(dato)
        })
    }
}

// ***** SEGUNDO MÉTODO (RENDERIZAR PRODUCTOS) *****

const totalCarrito = () => {
    return carrito.reduce((acumulador, {price, quantity}) => {
        return acumulador + (price * quantity)
    }, 0)
}

const totalCarritoRender = () => {
    const carritoTotal = document.getElementById("carritoTotal")
    carritoTotal.innerHTML = `<p class="lead my-5">Precio total: $ ${totalCarrito()} USD</p>`
}

const agregarCarrito = ({id, name, type, price, stock, description, quantity, image}) => {
    const productoEnCarrito = carrito.find(item => item.id === id);
    if (productoEnCarrito) {
        // Si el producto ya está en el carrito, actualizamos la cantidad
        productoEnCarrito.quantity += quantity;
    } else {
        // Si el producto no está en el carrito, lo agregamos
        carrito.push({id, name, type, price, stock, description, quantity, image});
    }
    totalCarritoRender();
    renderizarCarrito();
}

const renderizarProductos = (arrayUtilizado) => {
    const contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""
    arrayUtilizado.forEach(({id, name, type, price, stock, description, image}) => {
        const prodCard = document.createElement("div")
        prodCard.classList.add("card", "col-xs")
        prodCard.style.width = '270px';
        prodCard.style.height = '550px';
        prodCard.style.margin = '3px';
        prodCard.id = id
        prodCard.innerHTML = `
            <img src="${image}" class="card-img-top" style="height: 244px" alt="${name}">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <h6>${type}</h6>
                <p class="card-text">${description}</p>
                <span style="display: ${stock !== null ? 'inline' : 'none'}">Stock: ${stock}</span>
                <span>$ ${price}</span>
                <form id="form${id}">
                    <label for="contador${id}">Cantidad</label>
                    <input type="number" placeholder="0" id="contador${id}">
                    <button class="btn btn-primary" id="botonProd${id}">Agregar</button>
                </form>
            </div>`
        contenedorProductos.appendChild(prodCard)
        const btn = document.getElementById(`botonProd${id}`)
        btn.addEventListener("click", (evento) => {
            evento.preventDefault()
            const contadorQuantity = Number(document.getElementById(`contador${id}`).value)
            if (contadorQuantity > 0) {
                agregarCarrito({id, name, type, price, stock, description, quantity:contadorQuantity, image})
                renderizarCarrito()
                const form = document.getElementById(`form${id}`)
                form.reset()
            }
        })
    })
}

// ***** TERCER MÉTODO (RENDERIZAR CARRITO) *****

let carrito = JSON.parse(localStorage.getItem("carrito")) || []

const renderizarCarrito = () => {
    const listaCarrito = document.getElementById("listaCarrito");
    listaCarrito.innerHTML = "";
    carrito.forEach(({id, name, price, quantity, image}) => {
        let elementoLista = document.createElement("tr");
        elementoLista.innerHTML = `
        <td>
            <img src="${image}" class="card-img-top" style="height: 165.41px" alt="${name}">
        </td>
        <td style="width: 75%">
            <p style="background-color: #1c1c1e; color: #fff">${name}</p>
            <p style="background-color: #1c1c1e; color: #fff">Precio por unidad: ${price} USD</p>
            <p style="background-color: #1c1c1e; color: #fff">Cantidad: ${quantity}</p>
            <p style="background-color: #1c1c1e; color: #fff">Subtotal: ${price * quantity} USD</p>
        </td>
        <td style="width: 10%">
            <button style="background-color: #dc3545" id="eliminarCarrito${id}">X</button>
        </td>
        `;

        listaCarrito.appendChild(elementoLista);
        const botonBorrar = document.getElementById(`eliminarCarrito${id}`);
        botonBorrar.addEventListener("click", () => {
            carrito = carrito.filter((elemento) => elemento.id !== id);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderizarCarrito();
            totalCarritoRender();
        });
        localStorage.setItem("carrito", JSON.stringify(carrito));
    });
}

// ***** FILTRADO DE PRODUCTO *****
const selectorTipo = document.getElementById("tipoProducto")
selectorTipo.onchange = (event) => {
    const tipoSeleccionado = event.target.value
    if (tipoSeleccionado === "0") {
        renderizarProductos(productos)
    } else {
        renderizarProductos(productos.filter(prod => prod.type === tipoSeleccionado))
    }
}

// ***** FINALIZAR COMPRA *****
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

const borrarCarrito = () => {
    carrito.length = 0
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

const actualizarStockEnLocalStorage = () => {
    localStorage.setItem("productos", JSON.stringify(productos));
    renderizarProductos(productos);
};

const finalizarCompra = async (event) => {
    event.preventDefault();

    if (carrito.some(item => {
        const producto = productos.find(prod => prod.id === item.id);
        return producto.stock !== null && producto.stock < item.quantity;
    })) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay suficiente stock para completar la compra.'
        });
        return;
    }

    carrito.forEach(item => {
        const producto = productos.find(prod => prod.id === item.id);
        if (producto.stock !== null) {
            producto.stock -= item.quantity;
        }
    });

    totalCarritoRender();

    const data = new FormData(event.target);
    const cliente = Object.fromEntries(data);

    const ticket = { cliente: cliente, total: totalCarrito(), id: pedidos.length, productos: carrito };
    pedidos.push(ticket);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    const orden = {
        cliente: cliente,
        total: totalCarrito(),
        productos: carrito,
        fecha: new Date()
    };
    try {
        await addDoc(collection(db, "ordenes"), orden);
    } catch (error) {
        return;
    }

    borrarCarrito();
    Swal.fire(
        'Compra Exitosa!',
        'Muchas gracias por su compra, los esperamos pronto.',
        'success'
    );
    actualizarStockEnLocalStorage();
};

const compraFinal = document.getElementById("formCompraFinal")
compraFinal.addEventListener("submit", (event) => {
    event.preventDefault()
    if(carrito.length > 0) {
        finalizarCompra(event).then();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Por favor, agregue productos al carrito antes de finalizar la compra.'
        });
    }
})

// ***** PRINCIPAL *****
const app = () => {
    productosPreexistentes()
    renderizarProductos(productos)
    renderizarCarrito()
    totalCarritoRender()
}

app();
