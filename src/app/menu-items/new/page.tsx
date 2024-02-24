'use client';
import EditableForm from '@/components/EditableForm';
import useProfileCheck from '@/components/useProfileCheck';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type SizeType = {
    name: string,
    price: string,
    _id?: string
}

type PriorityType = {isPriority: boolean, priorityLabel: string};

export default function AddNewMenuItem() {

    const {status} = useSession();
    const {loading, isAdmin} = useProfileCheck();
    const [redirection, setRedirection] = useState(false);

    if(status === 'unauthenticated'){
        return redirect('/login');
    } else if(!isAdmin && loading) {
        return redirect('/profile');
    }

    const handleFormSubmit = async(itemName: string, itemDesc: string, itemPrice: string, menuImg: string, sizes: SizeType[], category: string, _priority: PriorityType) => {
        let newSizes:SizeType[] | [] = [];
        if(sizes.length > 0){
            newSizes = sizes.map(obj => {
                const {_id, ...newObj} = obj;
                return newObj;
            })
        }
        setRedirection(false);

        const saveMenuPromise = new Promise<string>(async(resolve, reject) => {
            try {
                const res = await fetch('/api/menu-items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({itemName, itemDesc, itemPrice, menuImg, sizes: newSizes, category, priority: _priority})
                });

                const data = await res.json();
                
                if(res.ok) {
                    setRedirection(true);
                    resolve(data);
                } else {
                    if(data.error.includes('E11000')){
                        reject(`${itemName} already exists!`);
                    }
                    reject('Something went wrong!');
                }
            }catch(err: any){
                reject(err.message);
            }
        });

        await toast.promise(saveMenuPromise, {
            loading: 'Adding new Menu item...',
            success: (data) => `Added ${data}`,
            error: (data) => data
        });
    }

    if(redirection){
        setRedirection(false);
        return redirect('/menu-items');
    }

    return (
        <>
            <EditableForm formType='ADD_MENU' isAdmin={isAdmin} handleFormSubmit={handleFormSubmit} />
        </>
    )
}
