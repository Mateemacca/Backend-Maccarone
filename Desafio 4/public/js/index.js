const socket = io()

socket.on('obtenerProductosWebSocket', function (productos) {
    actualizarListaProductos(productos);
});

function actualizarListaProductos(productos) {
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = ''; 

    productos.forEach(function (producto) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h2>${producto.title}</h2>
            <p>ID: ${producto.id}</p>
            <p>${producto.description}</p>
            <p>Codigo: ${producto.code}</p>
            <p>Precio: $${producto.price}</p>
        `;
        listaProductos.appendChild(listItem);
    });
}
