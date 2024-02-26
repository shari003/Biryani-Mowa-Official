'use client';
import { createContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

export const CartContext = createContext({});

export default function AppProvider({children}){

    const [cartProducts, setCartProducts] = useState([]);
    const ls = typeof window !== 'undefined' ? window.localStorage : null;

    
    useEffect(() => {
        if(ls && ls.getItem('cart')){
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    }, []);

    function removeCartProduct(prodId){
        const filtered = cartProducts.filter(item => item._id !== prodId);
        setCartProducts(filtered);
        saveCartToLS(filtered); 
    }

    function clearCart(){
        setCartProducts([]);
        saveCartToLS([]);
    }
    
    function saveCartToLS(cartProducts){
        if(ls){
            ls.setItem('cart', JSON.stringify(cartProducts));
        }
    }

    function addToCart(product, size=null) {
        let sizes = [];
        if(size !== null){
            sizes.push(size);
        }
        setCartProducts(prev => {
            const newProduct = {...product, sizes}; 
            const newProducts = [...prev, newProduct];
            saveCartToLS(newProducts);
            return newProducts;
        })
    }

    return (
        <SessionProvider>
            <CartContext.Provider value={{
                cartProducts,
                setCartProducts,
                addToCart,
                removeCartProduct,
                clearCart
            }}>
                {children}
            </CartContext.Provider>
        </SessionProvider>
    )
}