import styles from '../styles.js';
import { useState } from "react";
import { navLinks } from "./Nav.js";

const Footer = () => {
    const [active, setActive] = useState("Home");
    const [toggle, setToggle] = useState(false);
    return (
      <>
       <div className="bg-[#004170] w-full h-39 flex flex-col justify-center items-center">
        <h1 className="text-white font-semibold mt-4">Newsmaker360</h1>
        <div className="bg-[#004170] justify-center items-center flex flex-row mt-2 mb-2">
        <a href="/">
        <h1 className="text-white font-semibold">Home </h1>
        </a>
        <p className="text-white font-semibold mx-4"> | </p>
        <a href="/about">
        <h1 className="text-white font-semibold">About Us </h1>
        </a>
        {/* <p className="text-white font-semibold mx-4"> | </p>
        <a href="/contact">
        <h1 className="text-white font-semibold">Contact</h1>
        </a> */}
        {/* <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-semibold cursor-pointer text-[16px] ${
              active === nav.title ? "text-orange-800" : "text-white"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
          ))}
          </ul> */}
        </div> 
        <h1 className="text-white font-semibold mb-5">2026 © Copyright Newsmaker360. All Rights Reserved</h1>
       </div>
      </>
    );
};

export default Footer;