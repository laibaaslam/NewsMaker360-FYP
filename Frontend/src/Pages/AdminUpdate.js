import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { updateuserValidation } from '../helper/updateuserValidation.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Store/auth.js';

export const AdminUpdate = () => {
    const [data, setData] = useState({
        email: '',
        username: '',
        contact: '',
    });
    const params = useParams();
    const { authorizationToken } = useAuth();

    const getSingleUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/users/${params.id}`, {
                headers: {
                    Authorization: authorizationToken,
                },
            });
            setData(response.data.user);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load user');
        }
    };

    useEffect(() => {
        getSingleUserData();
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: data.email,
            username: data.username,
            contact: data.contact,
        },
        validationSchema: updateuserValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                const response = await axios.patch(
                    `http://localhost:8080/api/admin/users/update/${params.id}`,
                    values,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: authorizationToken,
                        },
                    }
                );
                if (response.data && response.data.success) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message || 'Updation failed');
                }
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message || 'Error in Updation');
                } else {
                    toast.error('An error occurred. Please try again later.');
                }
            }
        },
    });

    return (
        <div className="admin-form-wrap">
            <div className="admin-panel">
                <div className="admin-panel-header">
                    <h2>Edit account</h2>
                </div>
                <form className="admin-form" onSubmit={formik.handleSubmit}>
                    <div className="admin-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            {...formik.getFieldProps('email')}
                            type="text"
                            id="email"
                            autoComplete="off"
                            placeholder="Enter email address"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="admin-field-error">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className="admin-field">
                        <label htmlFor="username">Username</label>
                        <input
                            {...formik.getFieldProps('username')}
                            type="text"
                            id="username"
                            autoComplete="off"
                            placeholder="Enter username"
                        />
                        {formik.touched.username && formik.errors.username ? (
                            <div className="admin-field-error">{formik.errors.username}</div>
                        ) : null}
                    </div>

                    <div className="admin-field">
                        <label htmlFor="contact">Contact</label>
                        <input
                            {...formik.getFieldProps('contact')}
                            type="text"
                            id="contact"
                            autoComplete="off"
                            placeholder="Enter contact"
                        />
                        {formik.touched.contact && formik.errors.contact ? (
                            <div className="admin-field-error">{formik.errors.contact}</div>
                        ) : null}
                    </div>

                    <button type="submit" className="admin-btn admin-btn--primary">
                        Save changes
                    </button>
                </form>
            </div>
        </div>
    );
};
