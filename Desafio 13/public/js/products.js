const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

const addProductToCart = async (pid, cartId) => {
    try {
        const result = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${pid}`, {
            body: JSON.stringify({
                quantity: 1
            }),
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (result.ok) {
            Swal.fire({
                icon:'success',
                text: `Se agrego el producto al carrito`,
                toast: true,
                position: 'top-start',
                showConfirmButton: false, 
                timer: 1500
            });
        } else {
            Swal.fire({
                text: 'Error al agregar producto al carrito',
                toast: true,
                position: 'top-right',
                icon: 'error'
            });
        }
    } catch (error) {
        Swal.fire({
            text: 'Error al comunicarse con el servidor',
            toast: true,
            position: 'top-right',
            icon: 'error'
        });
    }
}

for (let btn of addToCartBtns) {
    btn.addEventListener('click', async (e) => {
        e.preventDefault(); 
        const cart = await getCartId(); 
        addProductToCart(btn.id, cart);
    });
}

async function getCartId() {
    try {
        const response = await fetch('http://localhost:8080/api/session/current');
        if (response.ok) {
            const data = await response.json();
            const cart =  data.user.cart
            return cart;
        } else {
            console.error('Error al obtener información de la sesión del usuario');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener información de la sesión del usuario:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-product-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = button.id;
            try {
                const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    console.log('Producto eliminado correctamente');
                
                    const productCard = document.getElementById(`product-${productId}`);
                    if (productCard) {
                        productCard.remove();
                    }
                } else {
                    console.error('Error al eliminar el producto');
                }
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        });
    });
});
