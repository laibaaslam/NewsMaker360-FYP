import axios from "axios";

export async function resetpassword(password, token, id) {
    const response = await axios.post(`http://localhost:8080/api/auth/reset-password?token=${token}&id=${id}`, { password });
    return response.data; // Return the response data directly
}

