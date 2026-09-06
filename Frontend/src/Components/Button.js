import React from 'react'

const Button = ({children, className}) => {
  return (
    <button className={className}>
      {children}
    </button>
  )
}

export default Button

// import React from 'react'

// const Button = (props) => {
//   return (
//     <button className='bg-[#E0F6FF] text-[#001E35] text-xl font-bold border border-[#001E35] font-[Poppins] py-2 px-6 md:ml-8 rounded hover:bg-white 
//     duration-500'>
//       {props.children}
//     </button>
//   )
// }

// export default Button