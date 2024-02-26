'use client';
import React from 'react'

type Props = {
    addressProps: any,
    setAddressProps: (type: 'phone'| 'streetAddress' | 'city' | 'postal' | 'country', val: string) => void
}

export default function UserAddressInputs({addressProps, setAddressProps}: Props) {

    const {phone, streetAddress, city, postal, country} = addressProps;

    return (
        <>
            <label>Phone Number</label>
            <input type="tel" placeholder='Phone' value={phone} onChange={(e) => setAddressProps('phone', e.target.value)} />

            <label>Street address</label>
            <input type="text" placeholder='Street address' value={streetAddress} onChange={(e) => setAddressProps('streetAddress', e.target.value)} />

            <div className="flex gap-2">
                <div>
                    <label>City</label>
                    <input type="text" placeholder='City' value={city} onChange={(e) => setAddressProps('city', e.target.value)} />
                </div>
                
                <div>
                    <label>Postal Code</label>
                    <input type="text" placeholder='Postal code' value={postal} onChange={(e) => setAddressProps('postal', e.target.value)} />
                </div>
            </div>

            <label>Country</label>
            <input type="text" placeholder='Country' value={country} onChange={(e) => setAddressProps('country', e.target.value)} />
        </>
    )
}
