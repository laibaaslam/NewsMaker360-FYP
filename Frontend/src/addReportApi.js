import axios from 'axios';

export const addReport = async (vlink, text, id) => {
    try {

        console.log("Sending Add Report Request ");
        const response = await axios.post('http://localhost:8080/api/reports/addreport', { userId: id, videoLink: vlink, transcribedText: text });
        console.log("Request Fulfiled ");
        console.log(response.data.report);
        return response;
    } catch (error) {
        console.log(" Request failed ");
        console.error('Error:', error.message);
        throw new Error(error.response?.data?.message || error.message || 'Failed to save report');
    }
};

