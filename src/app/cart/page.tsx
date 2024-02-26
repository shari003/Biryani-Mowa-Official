'use client';
import { CartContext } from '@/components/AppContext';
import SectionHeaders from '@/components/SectionHeaders';
import Trash from '@/components/icons/Trash';
import UserAddressInputs from '@/components/layout/UserAddressInputs';
import useProfileCheck from '@/components/useProfileCheck';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'

type SizeType = {
    name: string;
    price: string;
    _id: string;
};

type PriorityType = { isPriority: boolean; priorityLabel: string };

type MenuItemType = {
    _id: string;
    itemName: string;
    itemDesc: string;
    itemPrice: number;
    menuImg: string;
    sizes?: SizeType[];
    category: string;
    priority: PriorityType;
    cartId: string;
};

type ContextType = {
    addToCart: (item: MenuItemType, size: SizeType | null) => void;
    cartProducts: MenuItemType[];
    removeCartProduct: (prodId: string) => void;
};

export function calcCartProductPrice(cartProd: MenuItemType) {
    let price = Number(cartProd.itemPrice);
    if(cartProd.sizes !== undefined && cartProd.sizes.length > 0){
        let sizePrice = cartProd.sizes.reduce((acc, curr) => acc+Number(curr.price), 0);
        price += sizePrice;
    }
    return price;
}

export function calcCartProductsPrice(cartProds: MenuItemType[]) {
    let totalPrice = 0;
    cartProds.forEach(prod => {
        totalPrice += calcCartProductPrice(prod);
    });
    return totalPrice;
}

export default function CartPage() {

    const {userData} = useProfileCheck();    
    const [address, setAddress] = useState({});

    const [totalCartPrice, setTotalCartPrice] = useState(0);

    const [couponCode, setCouponCode] = useState('');
    const [couponCodeLabel, setCouponCodeLabel] = useState('Apply');
    const [couponApplyStatus, setCouponApplyStatus] = useState(false);
    const [couponError, setCouponError] = useState(false);
    const [couponDetails, setCouponDetails] = useState('');

    const { cartProducts, removeCartProduct }: ContextType = useContext<any>(CartContext);

    useEffect(() => {
        setTotalCartPrice(calcCartProductsPrice(cartProducts));
    }, [cartProducts])

    useEffect(() => {
        if(couponCode.length === 0){
            setCouponApplyStatus(false);
            setCouponCodeLabel('Apply');
            setCouponError(false);
            setCouponDetails('');
            setTotalCartPrice(calcCartProductsPrice(cartProducts));
        }
    }, [couponCode, cartProducts])

    useEffect(() => {
        if(userData){
            const {phone, streetAddress, city, postal, country} = userData;
            const addressFromProfile = {phone, streetAddress, city, postal, country};
            setAddress(addressFromProfile);
        }
    }, [userData]);

    function handleCoupon(){
        if(couponCode.length > 0 && !couponApplyStatus){
            // COUPON Validation
            let couponValid = true;
            if(couponValid) {
                const discount = 10/100;
                setCouponApplyStatus(true);
                setCouponError(false);
                setCouponDetails('10% discount availed!!');
                setTotalCartPrice(prev => prev-(prev*discount));
                setCouponCodeLabel('Applied');
            } else {
                setCouponApplyStatus(true);
                setCouponCodeLabel('Invalid');
                setCouponError(true);
                setCouponDetails('Invalid coupon code');
                setTotalCartPrice(calcCartProductsPrice(cartProducts));
            }
        }
    }

    function handleAddressChange(type: 'phone'| 'streetAddress' | 'city' | 'postal' | 'country', val: string) {
        setAddress(prev =>  ({...prev, [type]: val}))
    }

    return (
        <section className='mt-8'>
            <div className="text-center">
                <SectionHeaders mainHeader='Your cart' />
            </div>
                {cartProducts.length > 0 ? (
                    <div className='grid grid-cols-12 gap-7 mt-8'>
                        <div className='col-span-8'>
                            {cartProducts.map(prod => (
                                <div key={prod._id} className='flex items-start gap-4 py-4 my-2 border-b border-b-slate-400'>
                                    <div className='w-24'>
                                        {/* Left */}
                                        <Image className='rounded-lg' src={prod.menuImg} alt='DISH' width={240} height={240} />
                                    </div>
                                    <div className='flex flex-col grow'>
                                        {/* Right */}
                                        <h1 className='font-semibold'>
                                            {prod.itemName}
                                        </h1>
                                        {prod.sizes && prod.sizes.map(size => (
                                            <div key={size._id} className='text-sm text-slate-700'>
                                                <h3>Size: <span>{size.name}</span></h3>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex flex-col items-center gap-2'>
                                        <h1 className='text-lg font-semibold'>&#8377;{calcCartProductPrice(prod)}</h1>
                                        <div>
                                            <button 
                                                type='button'
                                                onClick={() => removeCartProduct(prod.cartId)}
                                                className='p-2 border-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white'>
                                                <Trash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className='py-4 text-right pr-3 text-xl'>
                                <span className='text-slate-500'>Subtotal: </span>
                                <span className='font-semibold'>&#8377;{totalCartPrice}</span>
                            </div>
                        </div>
                        <div className='col-span-4'>
                            <div className='bg-slate-300 p-4 rounded-lg '>
                                <h2>Checkout</h2>
                                <form>
                                    <UserAddressInputs addressProps={address} setAddressProps={handleAddressChange} />
                                    
                                    
                                    <div className="grid grid-cols-12 items-center gap-2">
                                        <div className='col-span-9'>
                                            <label>Apply Coupon</label>
                                            <input type="text" placeholder='Coupon code' value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                                        </div>
                                        
                                        <div className='mt-4 col-span-3'>
                                            <button 
                                                onClick={handleCoupon}
                                                className='pl-2 border-0 rounded' type='button'>
                                                    {couponCodeLabel}
                                            </button>
                                        </div>
                                    </div>
                                    {couponApplyStatus && !couponError && (
                                        <div className='pb-2 text-green-700'>
                                            {couponDetails}
                                        </div>
                                    )}
                                    {couponApplyStatus && couponError && (
                                        <div className='pb-2 text-red-700'>
                                            {couponDetails}
                                        </div>
                                    )}

                                    <button type="submit">Pay &#8377;{totalCartPrice}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='text-center mt-4'>
                        No Items in the Cart.
                    </div>
                )}
        </section>
    )
}
