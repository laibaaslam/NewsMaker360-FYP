import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { signupvalidation } from '../helper/signupvalidation.js';
import axios from 'axios';
import { useAuth } from '../Store/auth.js';

export const AdminAddUser = () => {
    const { authorizationToken } = useAuth();

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
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post(`http://localhost:8080/api/admin/users/add`, values, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: authorizationToken,
                    },
                });
                if (response.data && response.data.success) {
                    toast.success(response.data.message);
                    resetForm();
                } else {
                    toast.error(response.data.message || 'Add New User failed');
                }
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message || 'Error in Addition');
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
                    <h2>Create account</h2>
                </div>
                <form className="admin-form" onSubmit={formik.handleSubmit}>
                    <div className="admin-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            {...formik.getFieldProps('email')}
                            type="text"
                            id="email"
                            autoComplete="off"
                            placeholder="user@example.com"
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
                            placeholder="11-digit phone number"
                        />
                        {formik.touched.contact && formik.errors.contact ? (
                            <div className="admin-field-error">{formik.errors.contact}</div>
                        ) : null}
                    </div>

                    <div className="admin-field">
                        <label htmlFor="password">Password</label>
                        <input
                            {...formik.getFieldProps('password')}
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            onCopy={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="admin-field-error">{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <div className="admin-field">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            {...formik.getFieldProps('confirmPassword')}
                            type="password"
                            id="confirmPassword"
                            placeholder="Re-enter password"
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="admin-field-error">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>

                    <button type="submit" className="admin-btn admin-btn--primary">
                        Add User
                    </button>
                </form>
            </div>
        </div>
    );
};
