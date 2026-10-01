import axios from "axios";

const API_URL = "http://localhost:3000/api";


const getUsers = async (token) => {

    const response = await axios.get(
        `${API_URL}/users`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};


const updateProfile = async (
    token,
    name,
    email,
    profilePicture
) => {

    const formData = new FormData();

    formData.append(
        "name",
        name
    );

    formData.append(
        "email",
        email
    );


    // Add image only if user selected one

    if (profilePicture) {

        formData.append(
            "profilePicture",
            profilePicture
        );

    }


    const response = await axios.patch(
        `${API_URL}/users/profile`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );


    return response.data;
};


export {
    getUsers,
    updateProfile
};