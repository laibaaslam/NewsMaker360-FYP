import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout.js";
import styles from "../styles.js";
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');

    }
    return (
        <Layout>
            <div className="bg-custom-bg w-full h-80% overflow-auto">
                <div class="flex flex-col items-center justify-center h-screen">
                    <h1 class="text-4xl font-bold text-red-600 mb-2">Oops! Page Not Found</h1>
                    <h2 class="text-2xl font-semibold text-gray-600 mb-2">404</h2>
                    <button className={` px-7 py-2  ${styles.HB}`} onClick={handleClick}>Go Back</button>

                    {/* <a href="/" class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">Go Back</a> */}
                </div>
            </div>
        </Layout>
    );
};

export default ErrorPage;