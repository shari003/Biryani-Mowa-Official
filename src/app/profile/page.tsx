'use client';
import AdminTabs from '@/components/AdminTabs';
import EditableImage from '@/components/EditableImage';
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function ProfilePage() {

    const session = useSession();
    const {status} = session;
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [postal, setPostal] = useState('');
    const [country, setCountry] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileFetched, setProfileFetched] = useState(false);
    const [userImg, setUserImg] = useState('');

    const userInfo = async() => {
        setProfileFetched(false);
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();        
        
        if('error' in data){
            toast.error(data.error);
        }

        const {name, phone, streetAddress, city, postal, country, isAdmin} = data;
        setName(name);
        setPhone(phone);
        setStreetAddress(streetAddress);
        setCity(city);
        setPostal(postal);
        setCountry(country);
        setIsAdmin(isAdmin);
        setProfileFetched(true);
    }

    useEffect(() => {
        setUserImg('/user.png');
        userInfo();
    }, []);

    if(status === 'loading' || !profileFetched){
        return 'Loading...';
    } else if(status === 'unauthenticated'){
        return redirect('/login');
    }

    // useEffect(() => {
    //     if(status === 'authenticated'){
    //         const name = session.data?.user?.name as string;
    //     }
    // }, [status, session])

    async function handleProfileInfoUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const savingProfile = new Promise(async (resolve, reject) => {
                const res = await fetch('/api/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        streetAddress,
                        city,
                        postal,
                        country
                    })
                });

                if(res.ok) 
                    resolve('');
                else
                    reject();
            });

            await toast.promise(savingProfile, {
                loading: 'Saving...',
                success: 'Profile saved!',
                error: 'Some error occurred!'
            })

        }catch(err: any){
            toast.error(err.message);
        }
    }

    return (
        <section className='mt-8'> 

            <AdminTabs isAdmin={isAdmin} />

            <div className='max-w-2xl mx-auto mt-8'>
                <div className='flex gap-2'>
                    <div>
                        <div className="p-2 rounded-lg relative">
                            <EditableImage link={userImg} setLink={setUserImg} height={100} width={100} />
                        </div>
                    </div>
                    <form className='grow' onSubmit={handleProfileInfoUpdate}>

                        <label>Your name</label>
                        <input type="text" placeholder='Your name' value={name} onChange={(e) => setName(e.target.value)} />

                        <label>Email</label>
                        <input type="email" value={session.data?.user?.email as string} disabled={true} />

                        <label>Phone Number</label>
                        <input type="tel" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />

                        <label>Street address</label>
                        <input type="text" placeholder='Street address' value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />

                        <div className="flex gap-2">
                            <div>
                                <label>City</label>
                                <input type="text" placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                            
                            <div>
                                <label>Postal Code</label>
                                <input type="text" placeholder='Postal code' value={postal} onChange={(e) => setPostal(e.target.value)} />
                            </div>
                        </div>

                        <label>Country</label>
                        <input type="text" placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} />
                        <button type='submit'>Save</button>
                    </form>
                </div>
            </div>
        </section>
    )
}
