import axios from "axios";

export async function registerUser(credentials) {
    const response = await axios.post('http://localhost:8080/api/auth/signup', credentials);
    return response.data; // Return the response data directly

}