import React, { useEffect, useState } from 'react';

type SizeType = {
    name: string,
    price: string,
    _id: string
}

type PriorityType = {isPriority: boolean, priorityLabel: string};

type MenuItem = {
    _id: string,
    itemName: string,
    itemDesc: string,
    itemPrice: number,
    menuImg: string,
    sizes: SizeType[],
    category: string,
    priority: PriorityType
}

type Props = {
    order: {
        cartProducts: MenuItem[],
        orderStatus: string,
        createdAt: Date,
        finalCartValue: number
    }
}

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

export default function OrderSlabs({ order }: Props) {

    let orderDate:any = new Date(order.createdAt);
    orderDate = (monthNames[orderDate.getMonth()].slice(0,3)) + ' ' + (orderDate.getDate()+1) + ', ' + orderDate.getFullYear();

    return (
        <div className='grid grid-cols-12 gap-4 py-8 px-4 m-4 rounded-md bg-slate-300 text-slate-600'>
            <div className='col-span-5'>
                <h1>{order.cartProducts[0].itemName}{order.cartProducts.length > 1 ? `, ${order.cartProducts[1].itemName} ...(${order.cartProducts.length} items)` : ''}</h1>
            </div>
            <div className='col-span-3 text-center'>
                <h1>&#8377;{order.finalCartValue}</h1>
            </div>
            <div className='col-span-4 pr-4 flex justify-end items-center gap-2 font-semibold'>
                <span className={`w-2 h-2 block rounded-full ${order.orderStatus === 'DELIVERED' ? 'bg-green-600' : order.orderStatus === 'PLACED' ? 'bg-blue-600' : 'bg-red-600'}`}></span>
                <h1>{order.orderStatus} on {orderDate}</h1>
            </div>
        </div>
    )
}
