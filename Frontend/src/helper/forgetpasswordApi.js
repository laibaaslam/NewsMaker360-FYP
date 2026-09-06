import axios from "axios";

export async function forgetpasswordApi(email) {
    const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
    return response.data; // Return the response data directly
}

