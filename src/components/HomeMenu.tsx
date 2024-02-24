'use client';
import React, { useEffect, useState } from 'react'
import MenuCard from './MenuCard'
import SectionHeaders from './SectionHeaders'

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

export default function HomeMenu() {

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);    

    useEffect(() => {
        const fetchMenuItems = async() => {
            const res = await fetch('/api/menu-items', {
                method: 'GET',
            }) 

            if(res.ok){
                const data = await res.json();
                setMenuItems(data);
            }

        }

        fetchMenuItems();

    }, [])
    return (
        <section>
            {/* <div className="absolute h-full left-0 right-0 w-full justify-start">
                <div className='h-48 w-48 absolute -left-12'>
                    <Image src={'/DUM_BIRYANI.png'} alt='DUM_BIRYANI' layout={'fill'} objectFit='contain' />
                </div>
                <div className='h-96 w-48 absolute right-0 -top-24 -z-10'>
                    <Image src={'/SPICES.jpg'} alt='DUM_BIRYANI' layout={'fill'} objectFit='contain' />
                </div>
            </div> */}


            <div className='text-center mb-4'>
                <SectionHeaders subHeader='Our Best Sellers' mainHeader='Menu' />
            </div>
            {menuItems.length > 0 ? (  
                <div className="grid grid-cols-3 gap-4">
                    {menuItems.map(item => (
                        <MenuCard key={item._id} image_url={item.menuImg} title={item.itemName} subtitle={item.itemDesc} price={item.itemPrice} priority={item.priority} />
                    ))}
                </div>
            ) : (
                <h1>Loading Menu Items</h1>
            )}

            {/* <div className="grid grid-cols-3 gap-4">
                <MenuCard image_url='/DUM_BIRYANI.png' title='Hyderabadi Chicken Dum Biryani' subtitle='safsd' price={180} />
                <MenuCard image_url='/TOMATO_RICE.jpg' title='Tomato Rice' subtitle='safsd' price={80} />
                <MenuCard image_url='/OMLETTE.jpg' title='Omlette' subtitle='safsd' price={80} />
            </div> */}
            {/* <h1 className='text-2xl font-semibold mt-6'>For Pre orders:</h1>
            <div className="grid grid-cols-3 gap-4 mt-2">
            <MenuCard image_url='/CHICKEN_CURRY.jpg' title='Chicken Curry' subtitle='safsd' price={180} />
                <MenuCard image_url='/CHICKEN_FRY.jpg' title='Chicken Fry' subtitle='safsd' price={180} />
                <MenuCard image_url='/CHICKEN_PICKLE.jpg' title='Chicken Pickle' subtitle='safsd' price={500} />
            </div> */}

        </section>
    )
}
