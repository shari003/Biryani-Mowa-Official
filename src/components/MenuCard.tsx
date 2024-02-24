/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import React from 'react'

type PriorityType = {isPriority: boolean, priorityLabel?: string};

type Props = {
    image_url: string,
    alt?: string,
    title: string,
    subtitle: string,
    price: number,
    priority: PriorityType
}

export default function MenuCard({image_url, alt, title, subtitle, price, priority}: Props) {

    return (
        <div className="bg-slate-100 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-white transition-all hover:shadow-md hover:shadow-black/25 relative">
            {priority.isPriority && (
                <div className='absolute left-1 top-1 bg-black text-white px-4 py-1 rounded-lg'>
                    <span>{priority?.priorityLabel}</span>
                </div>
            )}
            <div className='text-center'>
                <img src={image_url} alt={alt || "DISH"} className='max-h-auto max-h-24 block mx-auto rounded-md object-fill' />
            </div>
            <h4 className='font-semibold text-lg my-3 text-wrap'>{title}</h4>
            <p className='text-slate-500 text-sm text-wrap line-clamp-3'>
                {subtitle}
            </p>
            <button className="bg-primary text-white rounded-full px-4 py-2 mt-4">Add to cart &#8377; {price}/-</button>
        </div>
    )
}
