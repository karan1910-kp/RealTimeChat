import axios from "axios";
import API_URL from "../constants/api";


const deleteMessage = async (messageId, token) => {

    const response = await axios.delete(
        `${API_URL}/messages/${messageId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const clearChat = async (userId, token) => {
    const response = await axios.delete(
        `${API_URL}/messages/clear/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};


const uploadFile = async (file, token) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await axios.post(
        `${API_URL}/messages/upload`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const getConversations = async (token) => {

    const response = await axios.get(
        `${API_URL}/messages/conversations`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const getMessages = async (token, userId) => {

    const response = await axios.get(
        `${API_URL}/messages/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const markMessagesAsSeen = async (token, userId) => {

    const response = await axios.patch(
        `${API_URL}/messages/${userId}/seen`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const getUnreadMessages = async (token) => {

    const response = await axios.get(
        `${API_URL}/messages/unread`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export {
    getConversations,
    getMessages,
    markMessagesAsSeen,
    getUnreadMessages,
    uploadFile,
    clearChat,
    deleteMessage
};