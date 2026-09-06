import axios from "axios";

export async function emailverificationApi(idandotp) {

    const response = await axios.post('http://localhost:8080/api/auth/verifyEmail', idandotp);
    return response.data; // Return the response data directly
}
