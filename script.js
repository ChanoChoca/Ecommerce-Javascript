// ***** SE CAMBIAN FONTS *****
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = 'https://fonts.googleapis.com/css?family=Roboto&display=swap';

document.head.appendChild(linkElement);

const elementos = document.querySelectorAll('p, h1, h2, label, option');

elementos.forEach((elemento) => {
    elemento.style.fontFamily = 'Roboto, sans-serif !important';
});

// ***** PRIMER MÉTODO (CARGA DE PRODUCTOS) *****
class Producto {
    constructor(id, name, type, price, stock, description) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }
}

const productosBase = [
    /* Aviso: los tanques se deben comprar solo una vez, esto es solamente prueba  */
    {id:"0", name:"VK 72.01 (K)", type:"Tanque", price:650, stock:1000, description:"Tanque pesado alemán de recompensa de nivel X"},
    {id:"1", name:"T95/FV4201 Chieftain", type:"Tanque", price:650, stock:1000, description:"Tanque pesado británico de recompensa de nivel X"},
    {id:"2", name:"Object 260", type:"Tanque", price:650, stock:1000, description:"Tanque pesado soviético de recompensa de nivel X"},
    {id:"3", name:"Object 907", type:"Tanque", price:650, stock:1000, description:"Tanque medio soviético de recompensa de nivel X"},
    {id:"4", name:"Object 279 early", type:"Tanque", price:650, stock:1000, description:"Tanque pesado soviético de recompensa de nivel X"},

    {id:"5", name:"WN8", type:"MejoraDeCuenta", price:12.94, stock:undefined, description:"12.94 USD * 10 batallas"}, /* por 10 batallas */
    {id:"6", name:"Créditos y Experiencia", type:"MejoraDeCuenta", price:8.82, stock:undefined, description:"8.82 USD * (1M créditos + 30K experiencia)"}, /* por 1m + 30k */
    {id:"7", name:"Créditos", type:"MejoraDeCuenta", price:5.95, stock:undefined, description:"5.95 USD * 1M créditos"}, /* por 1m */
    {id:"8", name:"Experiencia", type:"MejoraDeCuenta", price:9.44, stock:undefined, description:"9.44 USD * 50K experiencia"}, /* por 50k */
    {id:"9", name:"Bonos", type:"MejoraDeCuenta", price:16.96, stock:undefined, description:"16.96 USD * 100 bonos"} /* por 100 bonos */
]

const productos = JSON.parse(localStorage.getItem("productos")) || []

const agregarProducto = ({id, name, type, price, stock, description}) => {
    if (productos.some(prod => prod.id === id)) {
        // console.warn("Ya existe un producto con ese id") // esto lo podemos ahcer a futuro con lirberias
    } else {
        const productoNuevo = new Producto(id, name, type, price, stock, description)
        productos.push(productoNuevo) /* agrega al final */
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

const agregarCarrito = (objetoCarrito) => {
    carrito.push(objetoCarrito)
    totalCarritoRender()
}

const renderizarProductos = (arrayUtilizado) => {
    const contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""
    arrayUtilizado.forEach(({id, name, type, price, stock, description}) => {
        const prodCard = document.createElement("div")
        prodCard.classList.add("card", "col-xs")
        prodCard.style.width = '270px';
        prodCard.style.height = '550px';
        prodCard.style.margin = '3px';
        prodCard.id = id
        prodCard.innerHTML = `
            <img src="./assets/${id}.png" class="card-img-top" style="height: 244px" alt="${name}">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <h6>${type}</h6>
                <p class="card-text">${description}</p>
                <span style="display: ${stock !== undefined ? 'inline' : 'none'}">Stock: ${stock}</span>
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
                agregarCarrito({id, name, type, price, stock, description, quantity:contadorQuantity})
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
    listaCarrito.innerHTML=""
    carrito.forEach(({id, name, price, quantity}) => {
        let elementoLista = document.createElement("tr")
        elementoLista.innerHTML = `
        <td>
            <img src="./assets/${id}.png" class="card-img-top" style="height: 165.41px" alt="${name}">
        </td>
        <td style="width: 75%">
            <p style="background-color: #1c1c1e; color: #fff">${name}</p>
            <p style="background-color: #1c1c1e; color: #fff">Precio por unidad: ${price} USD</p>
            <p style="background-color: #1c1c1e; color: #fff">Subtotal: ${price * quantity} USD</p>
        </td>
        <td style="width: 10%">
            <button style="background-color: #dc3545" id="eliminarCarrito${id}">X</button>
        </td>
        `

        listaCarrito.appendChild(elementoLista)
        const botonBorrar = document.getElementById(`eliminarCarrito${id}`)
        botonBorrar.addEventListener("click", () => {
            carrito = carrito.filter((elemento) => {
                if (elemento.id !== id) {
                    return elemento
                }
            })
            let carritoString = JSON.stringify(carrito)
            localStorage.setItem("carrito", carritoString)
            renderizarCarrito()
            totalCarritoRender()
        })
        let carritoString = JSON.stringify(carrito)
        localStorage.setItem("carrito", carritoString)
    })
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
    let carritoString = JSON.stringify(carrito)
    localStorage.setItem("carrito", carritoString)
    renderizarCarrito()
}

const actualizarStockEnLocalStorage = () => {
    localStorage.setItem("productos", JSON.stringify(productos));
    renderizarProductos(productos);
};

const insuficienteStock = carrito.some(item => {
    const producto = productos.find(prod => prod.id === item.id);
    return producto.stock !== undefined && producto.stock < item.quantity;
});

const finalizarCompra = (event) => {
    event.preventDefault();

    let mensaje = document.getElementById("carritoTotal");

    if (insuficienteStock) {
        mensaje.innerHTML = "No hay suficiente stock para completar la compra.";
        return;
    }

    // Reducir el stock y finalizar la compra
    carrito.forEach(item => {
        const producto = productos.find(prod => prod.id === item.id);
        if (producto.stock !== undefined) {
            producto.stock -= item.quantity;
        }
    });

    const data = new FormData(event.target);
    const cliente = Object.fromEntries(data);
    const ticket = { cliente: cliente, total: totalCarrito(), id: pedidos.length, productos: carrito };
    pedidos.push(ticket);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    borrarCarrito();
    mensaje.innerHTML = "Muchas gracias por su compra, los esperamos pronto.";
    actualizarStockEnLocalStorage();
};

const compraFinal = document.getElementById("formCompraFinal")
compraFinal.addEventListener("submit", (event) => {
    event.preventDefault()
    if(carrito.length > 0) {
        finalizarCompra(event)
    } else {
        // console.warn("canasta vacia") // no para esta entrega, lo ahcemos a futuro con lirberias
        const mensajeCanastaVacia = document.getElementById("mensajeCanastaVacia");
        mensajeCanastaVacia.style.display = "block";
    }
})

// ***** PRINCIPAL *****

const app = ()=>{
    productosPreexistentes()
    renderizarProductos(productos)
    renderizarCarrito()
    totalCarritoRender()
}

app()
