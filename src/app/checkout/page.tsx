/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import SectionHeaders from '@/components/SectionHeaders';
import BillDetails from '@/components/layout/BillDetails';
import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const orderStatus = searchParams.get('orderStatus');
    const [orderStatusBackend, setOrderStatusBackend] = useState('');

    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        async function getOrderDetails(){
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'GET'
            });

            const data = await res.json();
            if(res.ok) {
                setOrderDetails(data);
                setOrderStatusBackend(data.orderStatus);
            }
        }   
        
        getOrderDetails();

    }, []);
    

    async function handleCheckout(){
        const res = await fetch(`/api/orders/${orderId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderStatus: 'PLACED'
            })
        });
        const data = await res.json();
        router.push(`/orders/${orderId}`);
    }

    if(orderDetails === null){
        return <h1>Loading...</h1>
    }

    const address = `${orderDetails?.streetAddress}, ${orderDetails?.city}, ${orderDetails?.country} - ${orderDetails?.postal}`;

    if(orderStatus !== orderStatusBackend){
        return redirect(`/orders/${orderId}`);
    }
    
    return (
        <section className='mt-8'>
            <div className="text-center flex flex-col gap-4">
                <SectionHeaders mainHeader='Checkout' />
                <SectionHeaders mainHeader='' subHeader='Order Summary' />
            </div>
            <div className='md:grid grid-cols-12 gap-12 mt-8'>
                <div className='col-span-4 p-4 md:p-0'>
                    <BillDetails header={`Order Summary (${orderDetails?.cartProducts.length} item)`} cartProducts={orderDetails?.cartProducts} totalCartPrice={orderDetails?.cartValue} discountedPrice={orderDetails?.discountValue} finalCartPrice={orderDetails?.finalCartValue} />
                </div>
                <div className="col-span-8 flex flex-col gap-3 p-3 md:p-0">
                    <div className='px-2 grow'>
                        <h1 className='font-semibold uppercase text-xl'>Address</h1>
                        <p className='text-lg'>
                            {address}
                        </p>
                    </div>
                    <div className='px-2 grow'>
                        <h1 className='font-semibold uppercase text-xl'>PAYMENT</h1>
                        <div className='py-1 flex gap-2'>
                            <span className='px-4 py-3 bg-black text-white cursor-pointer'>Cash On Delivery</span>
                            <span className='px-4 py-3 bg-slate-300 text-slate-600 cursor-not-allowed'>Pay Using UPI</span>
                        </div>
                    </div>
                    <div className='mt-10 w-3/4 md:w-3/12 px-2'>
                        <button onClick={handleCheckout} type='button' className='p-3 border-0 bg-primary text-white cursor-pointer rounded-none'>Pay Via COD</button>

                    </div>
                </div>
            </div>
        </section>
    )
}
