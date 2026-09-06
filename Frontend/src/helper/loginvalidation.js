import * as Yup from 'yup'


export const loginvalidation = Yup.object({
    email: Yup.string()
        .required('Email is required'),
    // .min(4, 'Username must be at least 4 characters')
    // .max(20, 'Username must be at most 20 characters')
    // .matches(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers'),
    password: Yup.string()
        .required('Password is required'),
    // .min(8, 'Password must be at least 8 characters')
    // .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    //     'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    // ),
})
