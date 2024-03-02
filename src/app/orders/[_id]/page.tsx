'use client';
import React, { useEffect, useState } from 'react'
import SectionHeaders from '@/components/SectionHeaders'
import { useParams } from 'next/navigation';
import UserAddressInputs from '@/components/layout/UserAddressInputs';
import CartProductLayout from '@/components/layout/CartProductLayout';
import BillDetails from '@/components/layout/BillDetails';

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
    updatedAt: string;
    createdAt: string;
};

type OrderType = {
    phone: string, 
    streetAddress: string, 
    city: string, 
    postal: string, 
    country: string,
    cartProducts: MenuItemType[],
    cartValue: number,
    finalCartValue: number,
    discountValue: number,
    orderStatus: string,
    paymentMode: string
}

export default function OrderPage() {

    const [order, setOrder] = useState<OrderType | null>(null);
    const {_id} = useParams();
    
    useEffect(() => {
        async function getOrder() {
            const res = await fetch(`/api/orders/${_id}`, {
                method: 'GET'
            });
            const data = await res.json(); 
            if(res.ok) setOrder(data);
        }

        getOrder();
    }, []);

    let obj: OrderType = {
        phone: '', 
        streetAddress: '', 
        city: '', 
        postal: '', 
        country: '',
        cartProducts: [],
        cartValue: 0,
        finalCartValue: 0,
        discountValue: 0,
        orderStatus: '',
        paymentMode: ''
    };
    if(order!==null) obj = {...order};

    return (
        <section className='max-w-6xl mx-auto text-center mt-12'>
            <SectionHeaders mainHeader={'Your Order'} />
            <div className="my-4">
                <p>Thanks for placing your Order.</p>
            </div>
            <div className='my-4 text-balance md:text-left'>
                <h1 className='text-xl font-semibold'>
                    Order Status: 
                    <span className={`${order?.orderStatus === 'DELIVERED' ? 'text-green-600' : order?.orderStatus === 'PLACED' ? 'text-blue-600' : 'text-red-600'}`}> {order?.orderStatus}
                    </span>
                </h1>
                <h1 className='text-xl font-semibold'>
                    Payment Method: <span className='text-green-600'>{order?.paymentMode}</span>
                </h1>
            </div>
            <div>
                {order !== null && (
                    <>
                        <div className='md:grid grid-cols-12 gap-8 mt-8'>
                            <div className='col-span-8 flex flex-col p-4'>
                                <h1 className='text-left font-semibold text-black text-xl'>Items in this order</h1>
                                {order.cartProducts !== undefined && order.cartProducts.map((item) => (
                                    <CartProductLayout trashIcon={false} key={item._id} prod={item} />
                                    ))}
                            </div>
                            
                            <div className='col-span-4'>
                                <div className="text-slate-300 p-4 rounded-md text-left">
                                    <h1 className='font-semibold text-black text-xl'>Delivery Address</h1>
                                    <UserAddressInputs setAddressProps={() => {}} addressProps={obj} disabled={true} />
                                </div>
                                <div className='text-left p-4'>
                                    <BillDetails header='BILLING' cartProducts={order.cartProducts} totalCartPrice={order.cartValue} finalCartPrice={order.finalCartValue} discountedPrice={order.discountValue} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
