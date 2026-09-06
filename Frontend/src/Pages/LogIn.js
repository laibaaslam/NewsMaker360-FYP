// rfc to create boiler code for login functional component
import React from 'react';
import { useFormik } from 'formik';
import { loginvalidation } from '../helper/loginvalidation.js';
import { loginUser } from '../helper/loginApi.js';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Store/auth.js';

export default function Login({ onClose, onSwitchToSignUp }) {
    const navigate = useNavigate();
    //
    const { StoreTokenInLS } = useAuth();


    // using formik for input field validation
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },

        validationSchema: loginvalidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values, { resetForm }) => {
            // Simulate form submission
            // console.log(values);
            try {
                const response = await loginUser(values);
                if (response && response.success) {

                    const token = response.token;
                    // console.log(token);
                    // storging JWT token to local storage
                    StoreTokenInLS(token);
                    // Registration successful
                    toast.success(response.message);
                    resetForm(); // Reset the form fields
                    // Optionally, redirect the user to another page or perform any other action
                    navigate("/user-dashboard");
                } else {
                    // Registration failed
                    toast.error(response.message || "Login failed");
                }
            } catch (error) {
                // Error occurred during registration process
                if (error.response) {
                    // Conflict error (user already exists)
                    toast.error(error.response.data.message);

                } else {
                    // Network error or other client-side error
                    // console.error("Client error:", error.message);
                    toast.error("An error occurred. Please try again later.");
                }
            }

        },
    });

    // if (!isVisible) return null;
    return (

        // here inset-0 tell button 1 will have this model which will blur bg and popup
        <div className="fixed inset-0 bg-opacity-25  backdrop-blur-sm font-poppins bg-black h-screen w-full flex flex-col justify-center p-5">

            <button className='flex flex-row justify-end text-white text-xl font-extrabold w-full mx-auto max-w-[500px]' onClick={onClose}>
                <span>
                    X
                </span>
            </button>

            <form className="bg-white rounded-md w-full mx-auto p-8 max-w-[500px]" onSubmit={formik.handleSubmit}>
                <h2 className="text-1.5xl text-left pt-4">
                    Welcome to <span className="font-semibold">Newsmaker360</span>
                </h2>
                <h2 className="text-1.7xl text-left font-semibold pb-1">Log in</h2>

                <div className='flex flex-col py-2'>

                    <label className="text-xs font-semibold pb-2" htmlFor="email" >Email Address</label>

                    <input {...formik.getFieldProps('email')} className=" text-xs border border-black rounded-md py-2 px-5" type="text"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email} placeholder="Enter your email" />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-xs">{formik.errors.email}</div>
                    ) : null}
                </div>

                <div className='flex flex-col pt-1 pb-2'>
                    <label className="text-xs font-semibold pb-2" htmlFor="password">Password</label>
                    <input {...formik.getFieldProps('password')} className=" text-xs border border-black rounded-md py-2 px-5" type="password"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        placeholder="Enter your password" />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-xs">{formik.errors.password}</div>
                    ) : null}
                </div>

                <div className="py-2 my-2 container flex flex-row justify-between">

                    <label className="flex flex-row justify-between items-center text-xs" htmlFor="rememberme">
                        <input type="checkbox" id="rememberme" className="form-checkbox h-3 w-3 transition duration-150 ease-in-out" />
                        <span className="ml-2">Remember me</span>
                    </label>
                    <a href='/forgot-password' className="text-black text-xs hover:underline ">Forgot Password?</a>
                </div>

                <button type="submit" className=' hover:bg-blue-900 bg-darkblue  text-white border border-black w-full rounded-xl py-1 px-5 mb-4'>Login</button>

                <div className='flex flex-row justify-center text-xs'>
                    <p>
                        Don't have an account?
                        <Link className='font-extrabold text-xs hover:underline ml-2' onClick={onSwitchToSignUp}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>

    )
}
// export default function Login({ isVisible, onCloseLogin, switchToSignUp }) {

//     if (!isVisible) return null;
//     return (
//         // here inset-0 tell button 1 will have this model which will blur bg and popup
//         <div className="fixed inset-0 bg-opacity-25  backdrop-blur-sm font-poppins bg-black h-screen w-full flex flex-col justify-center p-5">

//             <button className='flex flex-row justify-end text-white text-xl font-extrabold w-full mx-auto max-w-[500px]' onClick={() => onCloseLogin()}>
//                 <span>
//                     X
//                 </span>
//             </button>
//             <form className="bg-white rounded-md w-full mx-auto p-8 max-w-[500px]">
//                 <h2 className="text-1.5xl text-left pt-4">
//                     Welcome to <span className="font-semibold">Newsmaker360</span>
//                 </h2>
//                 <h2 className="text-1.7xl text-left font-semibold pb-1">Log in</h2>
//                 <div className='flex flex-col py-2'>
//                     <label className="text-xs font-semibold pb-2" htmlFor="username" >User name</label>
//                     <input className=" text-xs border border-black rounded-md py-2 px-5" type="text" id="username" placeholder="Enter your username" />
//                 </div>
//                 <div className='flex flex-col pt-1 pb-2'>
//                     <label className="text-xs font-semibold pb-2" htmlFor="password">Password</label>
//                     <input className=" text-xs border border-black rounded-md py-2 px-5" type="text" id="password" placeholder="Enter your password" />
//                 </div>

//                 <div className="py-2 my-2 container flex flex-row justify-between">

//                     <label className="flex flex-row justify-between items-center text-xs" htmlFor="rememberme">
//                         <input type="checkbox" id="rememberme" className="form-checkbox h-3 w-3 transition duration-150 ease-in-out" />
//                         <span className="ml-2">Remember me</span>
//                     </label>
//                     <a href="#" className="text-black text-xs hover:underline ">Forgot Password?</a>
//                 </div>
//                 <button className=' hover:bg-blue-900 bg-darkblue  text-white border border-black w-full rounded-xl py-1 px-5 mb-4'>Login</button>
//                 {/* <div className='flex flex-row justify-center text-xs'>
//                     <p>Don't have an account?<a className="font-extrabold hover:underline ml-2" href="#">Sign up</a></p>
//                 </div> */}
//                 <div className='flex flex-row justify-center text-xs'>
//       <p>
//         Don't have an account?
//         <span className='font-extrabold hover:underline ml-2' onClick={switchToSignUp}>
//           Sign up
//         </span>
//       </p>
//     </div>
//             </form>
//         </div>

//     )
// }