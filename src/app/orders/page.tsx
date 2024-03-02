/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import AdminTabs from '@/components/AdminTabs';
import SectionHeaders from '@/components/SectionHeaders';
import OrderSlabs from '@/components/layout/OrderSlabs';
import useProfileCheck from '@/components/useProfileCheck';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function OrdersPage() {
    const {isAdmin} = useProfileCheck();
    const [orders, setOrders] = useState<any>([]);
    const params = useSearchParams();   

    useEffect(() => {
        setOrders([]);
        async function getUsersAllOrders() {
            const res = await fetch('/api/orders', {
                method: 'GET'
            });
            const data = await res.json(); 
            if(res.ok) setOrders(data.reverse());
        }

        async function getAllOrders(){
            const res = await fetch('/api/orders?admin=true&orders=all', {
                method: 'GET'
            });
            const data = await res.json(); 
            if(res.ok) setOrders(data.reverse());
        }

        if(params.get('admin')){
            getAllOrders();
        } else {   
            getUsersAllOrders();
        }
    }, [params.get('admin')]);

    if(params.get('admin') && params.get('admin') !== null && !isAdmin){
        return redirect('/orders');
    }

    return (
        <section className='mt-8'>
            <AdminTabs isAdmin={isAdmin} />
            <div className="text-center my-8">
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
