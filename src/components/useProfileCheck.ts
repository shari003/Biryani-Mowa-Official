'use client';
import React, { useEffect, useState } from 'react'

export default function useProfileCheck() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    const userInfo = async () => {
        setLoading(false);
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        setIsAdmin(data.isAdmin);
        setLoading(true);
    }

    useEffect(() => {
        userInfo();
    }, [])

    return {loading, isAdmin}
}
