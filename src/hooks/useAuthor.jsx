import React from 'react';
import useAuth from './useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useAuthor = () => {
    const { user, loading } = useAuth()

    const {data: isAuthor, isLoading: isAuthorLoading} = useQuery({
        queryKey: ['isAuthor', user?.email],
        enabled: !loading, 
        queryFn: async () => {
        const res = await axios.get(`https://emon-blog-server.vercel.app/check-author/${user?.email}`)
        return res.data.author
    }})
    return [isAuthor, isAuthorLoading]
}

export default useAuthor;