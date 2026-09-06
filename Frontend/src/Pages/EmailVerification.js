import React from 'react'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom';
import { emailverificationApi } from '../helper/emailverificationApi.js';

export default function EmailVerification({ onClose, onSwitchToLogin }) {

    const formik = useFormik({
        initialValues: {
            userId: JSON.parse(localStorage.getItem('userId')),
            otp: '',

        },
        // validationSchema: signupvalidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            // Simulate form submission
            console.log(values);
            try {
                const response = await emailverificationApi(values);
                if (response && response.success) {
                    // Registration successful
                    toast.success(response.message);

                    // Clear local storage userID
                    localStorage.clear();

                    // Optionally, redirect the user to another page or perform any other action
                    // navigate("/");

                    onSwitchToLogin();

                } else {
                    // Verification failed
                    toast.error(response.message || "Verification failed");
                }
            } catch (error) {
                // Error occurred during registration process
                if (error.response) {
                    // Conflict error (user already exists)
                    toast.error(error.response.data.message || "Error while Email Verification");

                } else {
                    // Network error or other client-side error
                    // console.error("Client error:", error.message);
                    toast.error("An error occurred. Please try again later.");
                }
            }


        },
    });


    return (
        // here inset-0 tell button 1 will have this model which will blur bg and popup
        <div className="fixed inset-0 bg-opacity-25  backdrop-blur-sm font-poppins bg-black h-screen w-full flex flex-col justify-center p-5">
            {/* Cross button */}
            <button className='flex flex-row justify-end text-white text-xl font-extrabold w-full mx-auto max-w-[510px]' onClick={onClose}>
                <span>
                    X
                </span>
            </button>

            {/* Form for sign up */}
            <form className="bg-white rounded-md w-full mx-auto p-8 max-w-[510px]" onSubmit={formik.handleSubmit}>
                <h2 className="text-1.5xl text-left pt-4">
                    Welcome to <span className="font-semibold">Newsmaker360</span>
                </h2>
                <h2 className="text-1.7xl text-left font-semibold pb-1">Email Verification</h2>
                {/* for OTP */}
                <div className='flex flex-col py-2'>
                    <label className="text-xs font-semibold pb-2" htmlFor="otp" >Enter OTP</label>
                    <input {...formik.getFieldProps('otp')} className=" text-xs border border-black rounded-md py-2 px-5" type="text" id="otp"
                        name="otp"
                        onChange={formik.handleChange}
                        value={formik.values.otp} placeholder="Enter your OTP" />
                    {formik.touched.otp && formik.errors.otp ? (
                        <div className="text-red-500 text-xs">{formik.errors.otp}</div>
                    ) : null}
                </div>

                {/* Sign up button */}
                <button type="submit" className=' hover:bg-blue-900 bg-darkblue  text-white border border-black w-full rounded-xl py-1 px-5 mt-3 mb-4'>Verify</button>

                {/* <div className='flex flex-row justify-center text-xs'>
                    <p>
                        Already have an account?
                        <Link className='font-extrabold text-xs hover:underline ml-2' onClick={onSwitchToLogin}>
                            Log in
                        </Link>
                    </p>
                </div> */}
            </form>
        </div>


    )
}
