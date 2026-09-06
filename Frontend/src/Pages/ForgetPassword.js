import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';


import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles.js';
import { forgetpasswordvalidation } from '../helper/forgetpasswordvalidation.js';
import { forgetpasswordApi } from '../helper/forgetpasswordApi.js';
import Header from '../Components/Header.js';
import Footer from '../Components/Footer.js';
export default function ForgetPassword() {

    // const location = useLocation();
    // const [success, setsuccess] = useState(false);
    // // for response wait 
    // const [busy, setbusy] = useState(true);
    // // for conditional redenring tokin not found
    // const [InvalidUser, setInvalidUser] = useState('');
    const [error, seterror] = useState('');

    // const history = useHistory();
    // const navigate = useNavigate();


    // we want to render this page only if the user is valid and a token is valid we will do conditional rendering after verfiying token

    // const { token, id } = queryString.parse(location.search);

    // const verfiyToken = async () => {
    //     try {

    //         const { data } = await axios(`http://localhost:8080/api/auth/verify-token?token=${token}&id=${id}`);
    //         setbusy(false);

    //     } catch (error) {
    //         // printing error message coming from backend
    //         // checking resettign isvalid user if token is not valid

    //         const { data } = error.response;

    //         if (error?.response?.data) {
    //             setbusy(false);
    //             // console.log(busy)

    //             // console.log(data);
    //             if (!data.success) {
    //                 // console.log(setInvalidUser(data.message))
    //                 return setInvalidUser(data.message);
    //             }


    //             return console.log(error.response.data);
    //         }

    //         // console.log(error)
    //     }
    // }


    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: forgetpasswordvalidation,
        validateOnBlur: false,
        validateOnChange: false,

        onSubmit: async (values, { resetForm }) => {
            // Simulate form submission
            console.log(values);
            try {
                // setbusy(true);
                const response = await forgetpasswordApi(values.email);
                // setbusy(false);
                if (response && response.success) {

                    // change url 
                    // navigate('/reset-password');
                    // Registration successful
                    toast.success(response.message);
                    //  if password rest successful
                    // setsuccess(true);
                    // take to login form 
                    // navigate("/");
                    // history.goBack();
                    resetForm(); // Reset the form fields
                } else {
                    // Reset failed
                    toast.error(response.message || "Reset failed");
                }
            } catch (error) {

                const { data } = error.response;
                // Error occurred during registration process
                if (error.response) {
                    // Conflict error (user already exists)
                    toast.error(error.response.data.message || "Error while Password Reset");
                    //    displaying error 
                    // setbusy(false);

                    if (!data.success) {
                        // console.log(setInvalidUser(data.message))
                        return seterror(data.message);
                    }

                } else {
                    // Network error or other client-side error
                    // console.error("Client error:", error.message);
                    toast.error("An error occurred. Please try again later.");
                }
            }


        },
    });

    // run only once
    // useEffect(() => {
    //     verfiyToken();
    // }, []);

    // // if token is not valid
    // if (busy) return (<div className='max-w-screen-sm m-auto pt-40'>
    //     <h1 className='text-center text-3xl text-gray-500 mb-3'>
    //         Verfiying Request
    //     </h1>

    // </div>
    // );
    // if (success) return (<div className='max-w-screen-sm m-auto pt-40'>
    //     <h1 className='text-center text-3xl text-gray-500 mb-3'>
    //         Password Reset successfull
    //     </h1>

    // </div>
    // );

    // //    if token is not valid 
    // if (InvalidUser) return (
    //     <div className='max-w-screen-sm m-auto pt-40'>
    //         <h1 className='text-center text-3xl text-gray-500 mb-3'>
    //             {InvalidUser}
    //         </h1>

    //     </div>
    // );



    return (

        <div className="bg-custom-bg w-full h-auto overflow-auto">
            <Header />
            <img
                src="./dots.png"
                alt="Image Alt Text"
                className="absolute top-0 right-5 w-20 h-18 z-20"
            />
            <section className="bg-custom-bg h-screen flex flex-col items-center justify-center relative">

                {/* <div className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img src="./logo.png" alt="hoobank" className="mx-auto w-[300px] h-[300]" />
            </div> */}
                {/* <section className="h-full flex items-center justify-center bg-black"> */}
                <div className="flex flex-row w-full h-[80%]">
                    <div className="w-full p-4 font-poppin ml-20 mt-20 max-w-[500px] h-[100px]">

                        <form className="bg-white rounded-md mx-auto p-8 h-[300px]" onSubmit={formik.handleSubmit}>
                            <h2 className="text-1.5xl text-left pt-4">Welcome to <span className="font-semibold">Newsmaker360</span></h2>
                            <h2 className="text-1.5xl text-left font-semibold mt-1 pb-1">Forget Password</h2>
                            {error && <p className='text-center mb-2 mt-1 bg-red-500 ext-white rounded-md'>{error}
                            </p>}
                            <div className='flex flex-col py-2'>
                                <label className="text-xs font-semibold pt-2 pb-2" htmlFor="email" >Enter your email address</label>
                                <input {...formik.getFieldProps('email')} className=" text-xs border border-black rounded-md py-2 px-5" type="text" id="email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email} placeholder="Enter your email address" />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-xs">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            <button type="submit" className='hover:bg-blue-900 bg-darkblue text-white border border-black w-full rounded-xl py-1 px-5 mt-4 mb-4'>Send Link</button>
                        </form>
                    </div>

                    <div className={`flex-1 ${styles.flexCenter} justify-end items-end`}>
                        <img src="./Bg.png" alt="bg" className="w-[90%] h-[90%] relative z-[5] ml-50" />
                    </div>
                </div>
                {/* </section> */}
            </section >
            <Footer />
        </div >

    );

}
