export const validateEmail = (email) => {
const trimmedEmail = email.trim();


const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (!trimmedEmail) {
    return "Email address is required.";
}

if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email address.";
}

return "";
};