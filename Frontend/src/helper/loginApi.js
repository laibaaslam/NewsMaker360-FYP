import axios from "axios";

export async function loginUser(credentials) {
    const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
    return response.data; // Return the response data directly

}