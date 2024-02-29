'use client';

import SectionHeaders from '@/components/SectionHeaders';
import OrderSlabs from '@/components/layout/OrderSlabs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function OrdersPage() {

    const [orders, setOrders] = useState<any>([]);

    useEffect(() => {
        async function getAllOrders() {
            const res = await fetch('/api/orders', {
                method: 'GET'
            });
            const data = await res.json(); 
            console.log(data);
              
            if(res.ok) setOrders(data);
        }

        getAllOrders();
    }, [])

    return (
        <section className='mt-8'>
            <div className="text-center my-4">
                <SectionHeaders mainHeader={'Your Orders'} />
            </div>
            {orders.length > 0 ? (
                <div>
                    {orders.map((order: any) => (
                            <Link key={order._id} href={`/orders/${order._id}`}>
                                <OrderSlabs order={order} />
                            </Link>
                    ))}
                </div>
            ) : (
                <div className='text-center'>
                    No Orders
                </div>
            )}
        </section>
    )
}
