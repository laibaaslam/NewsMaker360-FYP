import * as Yup from 'yup'

// email: 'john123@example.com',
//   username: 'john_doe123',
//   contact: 923001234567, // Dummy Pakistani phone number
//   password: 'Password@123!'
export const forgetpasswordvalidation = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Email format username@yourdomain.com'
        )
        .required('Email is required'),
});

