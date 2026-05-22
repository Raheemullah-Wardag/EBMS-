import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = (token) => {
        const decoded = jwtDecode(token);
        const userData = {
            token,
            userID:   decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            email:    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            role:     decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAdmin    = () => user?.role === 'Admin';
    const isManager  = () => user?.role === 'Admin' || user?.role === 'Manager';
    const isEmployee = () => ['Admin', 'Manager', 'Employee'].includes(user?.role);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isManager, isEmployee }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);