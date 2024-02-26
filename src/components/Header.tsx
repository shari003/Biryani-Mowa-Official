'use client';
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import BRAND_LOGO from '../../public/BRAND_LOGO.jpg'
import { signOut, useSession } from 'next-auth/react'
import { CartContext } from './AppContext';
import ShoppingCart from './icons/ShoppingCart';

type SizeType = {
    name: string,
    price: string,
    _id: string
}

type PriorityType = {isPriority: boolean, priorityLabel: string};

type MenuItemType = {
    _id: string,
    itemName: string,
    itemDesc: string,
    itemPrice: number,
    menuImg: string,
    sizes?: SizeType[],
    category: string,
    priority: PriorityType
}

type ContextType = {
    addToCart: (item: MenuItemType, sizes?: SizeType) => void,
    cartProducts: MenuItemType[]
}

export default function Header() {

    const session = useSession();
    const {status} = session;
    const {cartProducts}:ContextType = useContext<any>(CartContext);

    let userName = session?.data?.user?.name || session?.data?.user?.email;
    if(userName && userName.includes(' ')){
        userName = userName.split(' ')[0];
    } else if(userName && userName.includes('@')){
        userName = userName.split('@')[0];
    }

    return (
        <>
            <header className='flex items-center justify-between'>
                <nav className='flex items-center gap-8 text-slate-600 font-semibold'>
                    <Link href="/" className="flex items-center gap-2">
                        <Image src={BRAND_LOGO} alt='BRAND_LOGO' className='w-16 rounded-full border-2 border-primary' />
                        <span className='brand__name text-primary text-2xl '>Biryani Mowa</span>
                        
                    </Link>
                    <Link className='hover:text-primary' href={'/'}>Home</Link>
                    <Link className='hover:text-primary' href={'/menu'}>Menu</Link>
                    <Link className='hover:text-primary' href={'/#about'}>About</Link>
                    <Link className='hover:text-primary' href={'/#contact'}>Contact</Link>
                    
                </nav>
                <nav className="flex items-center gap-4 text-slate-600 font-semibold">
                    {status === 'authenticated' && (
                        <>
                            <Link className='text-primary font-semibold whitespace-nowrap' href={'/profile'}>Hello, {userName}</Link>
                            <Link className='relative' href={'/orders'}>
                                <ShoppingCart />
                                <span className='absolute -top-2 -right-2 bg-primary text-white text-xs p-1 rounded-full leading-3'>{cartProducts.length}</span>
                            </Link>
                            <button onClick={() => signOut()} className='bg-primary text-white px-8 py-2 rounded-full'>Logout</button>
                        </>
                    )}
                    {status !== 'authenticated' && (
                        <>
                            <Link href={'/login'}>Login</Link>
                            <Link className='bg-primary text-white px-8 py-2 rounded-full' href={'/register'}>Register</Link>
                        </>
                    )}
                </nav>
            </header>
        </>
    )
}
