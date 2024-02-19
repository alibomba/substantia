import { createContext, useState, useEffect } from "react";
import axios from "axios";
import axiosClient from "../axiosClient";

interface Props {
    children: React.ReactNode;
}

export const AuthContext = createContext<MyAuthContext>({ isAuthorized: false, isLoading: true, setIsAuthorized: () => false, payload: { id: '', email: '', username: '', slug: '', avatar: null, hasChannel: false }, setPayload: () => ({}) });

export const AuthProvider = ({ children }: Props) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [payload, setPayload] = useState<UserPayload>({ id: '', email: '', username: '', slug: '', avatar: null, hasChannel: false });

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            try {
                const { data } = await axiosClient({
                    method: 'get',
                    url: '/auth',
                    cancelToken: source.token
                });
                setPayload(data);
                setIsAuthorized(true);
            } catch (err) {
                setIsAuthorized(false);
            }
            setIsLoading(false);
        }

        fetchData();

        return () => {
            source.cancel();
        }

    }, []);

    const initialValue: MyAuthContext = {
        isAuthorized,
        setIsAuthorized,
        isLoading,
        payload,
        setPayload
    }

    return (
        <AuthContext.Provider value={initialValue}>
            {children}
        </AuthContext.Provider>
    )
}