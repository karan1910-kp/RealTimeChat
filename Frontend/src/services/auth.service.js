import axios from "axios";
import API_URL from "../constants/api";

const login = async (email, password) => {

    const response = await axios.post(
        `${API_URL}/auth/login`,
        {
            email,
            password
        },
        {
            withCredentials: true
        }
    );

    return response.data;
};

const getMe = async (token) => {

    const response = await axios.get(
        `${API_URL}/auth/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
    );

    return response.data;
};

const register = async (name, email, password) => {

    const response = await axios.post(
        `${API_URL}/auth/register`,
        {
            name,
            email,
            password
        }
    );

    return response.data;
};
const deleteAccount = async (token, password) => {

    const response = await axios.delete(
        `${API_URL}/auth/account`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                password
            }
        }
    );

    return response.data;
};
const verifyPassword = async (
    token,
    password
) => {

    const response = await axios.post(
        `${API_URL}/auth/verify-password`,
        {
            password
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};


export {
    login,
    getMe,
    register,
    deleteAccount,
    verifyPassword,

};