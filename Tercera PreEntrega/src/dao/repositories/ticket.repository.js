import ticketModel from "../models/ticket.model.js";
import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";


class TicketRepository {
    async processCartPurchase(cartId, userEmail) {
        const cart = await cartModel.findById(cartId).populate('products.product');
    
        if (!cart) {
            console.log('Carrito no encontrado');
        }
    
        const purchasedProducts = [];
        const failedProducts = [];
    
        for (const productItem of cart.products) {
            const product = productItem.product;
            const quantity = productItem.quantity;
            let productPrice = +product.price;
           
            let productStock = product.stock
            if (productStock >= quantity) {
                productStock -= quantity;
                await product.save();
                console.log(product.price)
                purchasedProducts.push({ product: product._id, price:product.price, quantity });
            } else {
                failedProducts.push(product._id);
            }
        }


        const ticketData = {
            code: this.generateCode(),
            purchase_datetime: new Date(),
            amount: this.calculateTotalAmount(purchasedProducts),
            purchaser: userEmail,
            products: purchasedProducts
        };

        const ticket = new ticketModel(ticketData);
        await ticket.save();
        cart.products = cart.products.filter(item => !failedProducts.includes(item.product._id.toString()));
        await cart.save();

        return { ticket, failedProducts };
    }



        generateCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 8;
        let code = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
    
        return code;
    }

   
    calculateTotalAmount(purchasedProducts) {
        return purchasedProducts.reduce((total, product) => {
            return total + (product.quantity * product.price); 
        }, 0);
    }
}

export default TicketRepository;