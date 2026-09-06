import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/resetpasswordValidation.js';
import { resetpassword } from '../helper/resetpasswordApi.js';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

export default function ResetPassword() {
    const location = useLocation();
    const [success, setsuccess] = useState(false);
    // for response wait 
    const [busy, setbusy] = useState(true);
    // for conditional redenring tokin not found
    const [InvalidUser, setInvalidUser] = useState('');
    const [error, seterror] = useState('');
    const navigate = useNavigate();


    // we want to render this page only if the user is valid and a token is valid we will do conditional rendering after verfiying token

    const { token, id } = queryString.parse(location.search);

    const verfiyToken = async () => {
        try {

            const { data } = await axios(`http://localhost:8080/api/auth/verify-token?token=${token}&id=${id}`);
            setbusy(false);

        } catch (error) {
            // printing error message coming from backend
            // checking resettign isvalid user if token is not valid

            const { data } = error.response;

            if (error?.response?.data) {
                setbusy(false);
                // console.log(busy)

                // console.log(data);
                if (!data.success) {
                    // console.log(setInvalidUser(data.message))
                    return setInvalidUser(data.message);
                }


                return console.log(error.response.data);
            }

            // console.log(error)
        }
    }


    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: resetPasswordValidation,
        validateOnBlur: false,
        validateOnChange: false,

        onSubmit: async values => {
            // Simulate form submission
            // console.log(values);
            try {
                setbusy(true);
                const response = await resetpassword(values.password, token, id);
                setbusy(false);
                if (response && response.success) {

                    // change url 
                    navigate('/reset-password');
                    // Registration successful
                    toast.success(response.message);
                    //  if password rest successful
                    setsuccess(true);
                    // take to login form 
                    // Close the window after a certain delay
                    setTimeout(() => {
                        window.close();
                    }, 3000);
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
                    setbusy(false);

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
    useEffect(() => {
        verfiyToken();
    }, []);

    // if token is not valid
    if (busy) return (<div className='max-w-screen-sm m-auto pt-40'>
        <h1 className='text-center text-3xl text-gray-500 mb-3'>
            Verfiying Request
        </h1>

    </div>
    );
    if (success) return (<div className='max-w-screen-sm m-auto pt-40'>
        <h1 className='text-center text-3xl text-gray-500 mb-3'>
            Password Reset successful, You can Login Now!!
        </h1>

    </div>
    );

    //    if token is not valid 
    if (InvalidUser) return (
        <div className='max-w-screen-sm m-auto pt-40'>
            <h1 className='text-center text-3xl text-gray-500 mb-3'>
                {InvalidUser}
            </h1>

        </div>
    );



    return (
        <section className="bg-custom-bg h-screen flex flex-col items-center justify-center">
            <div className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img src="./logo.png" alt="hoobank" className="mx-auto w-[300px] h-[300]" />
            </div>
            <div className="font-poppin w-full max-w-[500px]">
                <form className="bg-white rounded-md mx-auto p-8" onSubmit={formik.handleSubmit}>
                    <h2 className="text-1.5xl text-left pt-4">Welcome to <span className="font-semibold">Newsmaker360</span></h2>
                    <h2 className="text-1.7xl text-left font-semibold pb-1">Reset Password</h2>
                    {error && <p className='text-center mb-2 mt-1 bg-red-500 ext-white rounded-md'>{error}
                    </p>}
                    <div className='flex flex-col pt-1 pb-2'>
                        <label className="text-xs font-semibold pb-2" htmlFor="password">Password</label>
                        <input {...formik.getFieldProps('password')} className=" text-xs border border-black rounded-md py-2 px-5"
                            type="password"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            placeholder="Enter your password"
                            onCopy={(e) => e.preventDefault()} // Prevent copying of the password field
                            onPaste={(e) => e.preventDefault()} // Prevent pasting into the password field
                            onSelect={(e) => e.preventDefault()} // Prevent selecting content in the password field
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-xs">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    {/* Confirm password */}
                    <div className='flex flex-col pt-1 pb-2'>
                        <label className="text-xs font-semibold pb-2" htmlFor="confirmPassword">Confirm Password</label>
                        <input {...formik.getFieldProps('confirmPassword')} className=" text-xs border border-black rounded-md py-2 px-5"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                            placeholder="Re-enter your password"
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onSelect={(e) => e.preventDefault()} // Prevent selecting content in the password field
                        // Prevent copying of the password field
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="text-red-500 text-xs">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>


                    <button type="submit" className='hover:bg-blue-900 bg-darkblue text-white border border-black w-full rounded-xl py-1 px-5 mt-4 mb-4'>Reset Password</button>
                </form>
            </div>
        </section>
    );
}
