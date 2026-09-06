
import * as Yup from 'yup'

// email: 'john123@example.com',
//   username: 'john_doe123',
//   contact: 923001234567, // Dummy Pakistani phone number
//   password: 'Password@123!'
export const signupvalidation = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Email format username@yourdomain.com'
        )
        .required('Email is required'),
    username: Yup.string()
        .min(4, 'Username must be at least 4 characters')
        .max(20, 'Username must be at most 20 characters')
        .matches(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
        .required('Username is required'),
    contact: Yup.string()
        .required('Contact is required')
        .test('is-11-digits', 'Contact must be exactly 11 digits', value =>
            value ? /^\d{11}$/.test(value) : true
        ),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});
// {
//     username: Yup.string()
//         .required('Username is required')
//         .min(4, 'Username must be at least 4 characters')
//         .max(20, 'Username must be at most 20 characters')
//         .matches(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers'),
//     password: Yup.string()
//         .required('Password is required')
//         .min(8, 'Password must be at least 8 characters')
//         .matches(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
//             'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
//         ),
// }