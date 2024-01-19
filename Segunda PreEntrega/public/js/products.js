const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

const addProductToCart = async (pid)=>{
    try {
        const result = await fetch(`http://localhost:8080/api/carts/659f73985c9c38fd3898dfdc/product/${pid}`, {
         body:JSON.stringify({
             quantity:1
     
         }),
         method:'post',
         headers:{
             'Content-Type':'application/json'
         }
        })
        if(result){
         alert("Producto agregado al carrito")
        }else{
         alert('Error al agregar producto al carrito')
        }
        
    } catch (error) {
        alert('error')
    }
}

for (let btn of addToCartBtns) {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); 
        addProductToCart(btn.id);
    });
}