// rfc to create boiler code for login functional component
import { React, useState } from 'react'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom';
import { signupvalidation } from '../helper/signupvalidation.js';
import { registerUser } from '../helper/signUpApi.js';

// import EmailVerification from '../Pages/EmailVerification.js';


export default function SignUp({ onClose, onSwitchToLogin }) {

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            contact: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: signupvalidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            // Simulate form submission
            console.log(values);
            try {
                const response = await registerUser(values);
                if (response && response.success) {
                    // Registration successful
                    toast.success(response.message);

                    // After successful sign-up setting local userid value

                    localStorage.setItem('userId', JSON.stringify(response.user.id));

                    // Optionally, redirect the user to another page or perform any other action
                    // navigate("/");
                    // OTP verification is disabled, so move user to login directly.
                    onSwitchToLogin();


                } else {
                    // Registration failed
                    toast.error(response.message || "Registration failed");
                }
            } catch (error) {
                // Error occurred during registration process
                if (error.response) {
                    // Conflict error (user already exists)
                    toast.error(error.response.data.message || "User already exists");

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
                <h2 className="text-1.7xl text-left font-semibold pb-1">Sign Up</h2>
                {/* for email address */}
                <div className='flex flex-col py-2'>
                    <label className="text-xs font-semibold pb-2" htmlFor="email" >Enter your email address</label>
                    <input {...formik.getFieldProps('email')} className=" text-xs border border-black rounded-md py-2 px-5" type="text" id="email"
                        name="email"
                        autoComplete='off'
                        onChange={formik.handleChange}
                        value={formik.values.email} placeholder="Enter your email address" />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-xs">{formik.errors.email}</div>
                    ) : null}
                </div>
                {/* username and contact */}
                <div className="flex flex-row ">
                    <div className='flex flex-col py-2'>
                        <label className="text-xs font-semibold pb-2" htmlFor="username">Username</label>
                        <input {...formik.getFieldProps('username')} className=" text-xs border border-black rounded-md py-2 px-9" type="text" id="username"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username} placeholder="Enter your username" />
                        {formik.touched.username && formik.errors.username ? (
                            <div className="text-red-500 text-xs">{formik.errors.username}</div>
                        ) : null}
                    </div>
                    <div className='flex flex-col py-2 ml-3'>
                        <label className="text-xs font-semibold pb-2" htmlFor="contact">Contact</label>
                        <input {...formik.getFieldProps('contact')} className=" text-xs border border-black rounded-md py-2 px-9" type="text" id="contact"
                            name="contact"
                            onChange={formik.handleChange}
                            value={formik.values.contact}
                            placeholder="Enter your contact" />
                        {formik.touched.contact && formik.errors.contact ? (
                            <div className="text-red-500 text-xs">{formik.errors.contact}</div>
                        ) : null}
                    </div>
                </div>

                {/* for password */}
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

                {/* Sign up button */}
                <button type="submit" className=' hover:bg-blue-900 bg-darkblue  text-white border border-black w-full rounded-xl py-1 px-5 mt-3 mb-4'>SignUp</button>

                <div className='flex flex-row justify-center text-xs'>
                    <p>
                        Already have an account?
                        <Link className='font-extrabold text-xs hover:underline ml-2' onClick={onSwitchToLogin}>
                            Log in
                        </Link>
                    </p>
                </div>
            </form>
        </div>

    )
}
