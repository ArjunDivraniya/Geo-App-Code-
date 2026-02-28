import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const checkLoggedIn = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                // Optionally fetch user profile from API here
                setUser({ token });
            }
        } catch (e) {
            console.log("Error reading token", e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await API.post("/auth/login", { email, password });
        const { token, user } = res.data;
        await SecureStore.setItemAsync("token", token);
        setUser({ ...user, token });
    };

    const register = async (name, email, password) => {
        const res = await API.post("/auth/register", { name, email, password });
        const { token, user } = res.data;
        await SecureStore.setItemAsync("token", token);
        setUser({ ...user, token });
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
