export const navLinks = [
  {
    id: "home",
    title: "HOME",
    link:""
  },
  {
    id: "generate",
    title: "GENERATE",
    link:""
  },
  {
    id: "about",
    title: "ABOUT US",
    link:""
  },
  {
    id: "contact",
    title: "CONTACT",
    link:""
  },
];

// import { useState } from "react";
// import Menu from "./M";
// import x from  "./X";
// import Button from "./Button";

//   const NavLinks = () => {
//     let Links = [
//         { name: "HOME", link: "/" },
//         { name: "ABOUT US", link: "/" },
//         { name: "GENERATE", link: "/" },
//         { name: "CONTACT", link: "/" },
//       ];
    
//     return (
//       <>
//         <div>
//        <ul className="flex items-center md:pb-0 pb-2">
//          {Links.map((link) => (
//            <li key={link.name} className="ml-2 text-xl my-2">
//              <a href={link.link} className="text-[#004170] font-semibold hover:text-gray-400 duration-500">
//                {link.name}
//              </a>
//            </li>
//          ))}
//          <li className="ml-2 my-2">
//            <Button>SIGN UP</Button>
//          </li>
//          <li className="ml-0 my-2">
//            <Button>LOG IN</Button>
//          </li>
//        </ul>
//        </div>
//       </>
//     );
//   };

//   const Nav = () => {
//     const [isOpen, setIsOpen] = useState(false);
  
//     const toggleNavbar = () => {
//       setIsOpen(!isOpen);
//     };
//     return (
//         <>
//           <nav className="flex w=1/3 items-center justify-end overflow-hidden">
//             <div className="hidden w-full justify-between md:flex">
//               <NavLinks />
//             </div>
//             <div className="flex w-[75px] justify-end md:hidden">
//               <button onClick={toggleNavbar}>{isOpen ? <x /> : <Menu />}</button>
//             </div>
//           </nav>
//           {isOpen && (
//             <div className="flex basis-full flex-col items-center">
//              <NavLinks/>
//             </div>
//   )}
//   </>
//     );
//           };

// export default Nav;