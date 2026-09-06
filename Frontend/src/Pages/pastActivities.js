import React, { useState, useEffect } from 'react';
import Header from '../Components/Header.js';
import Footer from '../Components/Footer.js';
import '../App.css';
import axios from 'axios';
import Accordion from '../Components/Accordion.js';
import { useAuth } from '../Store/auth.js';

const Activities = () => {
    // console.log("hiii");
    const { User } = useAuth();
    const [reports, setReports] = useState([]);
    const getAllReportsData = async () => {
        try {
            // console.log("hiii");

            const response = await axios.get(`http://localhost:8080/api/reports/getreports/${User._id}`);
            console.log(" Request Fulfiled ");
            setReports(response.data.reports);

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getAllReportsData();
    }, []);

    return (
        <>
            <div className="bg-custom-bg w-full h-screen overflow-auto flex flex-col">
                <Header />
                <img
                    src="./dots.png"
                    alt="Image Alt Text"
                    className="absolute top-0 right-5 w-20 h-18 z-10"
                />
                <section
                    id="home"
                    className="flex flex-1 flex-col items-center justify-center mt-0"
                >
                    <br /><br />
                    <div className="flex-1 flex flex-col">
                        <h1 className="ml-20 mt-15 font-sans text-6xl font-semibold text-[#001E35] max-w-[800px] ss:leading-[100.8px] leading-[75px]" style={{ textShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
                            <span className="text-gradient">Past Activities</span>
                        </h1>
                    </div>
                </section>
                <div className=" justify-center items-center mb-20">
                    <Accordion reports={reports} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Activities;

























