import Header from '../Components/Header.js';
import Footer from '../Components/Footer.js';
import Channels from '../Components/Channels.js';
import PC from '../Components/PieChart.js';
import '../App.css';
import styles from '../styles.js';
import Button from '../Components/Button.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Store/auth.js';
import { useState } from 'react';
import React from 'react';
import Dialog from '../Components/DialogBox.js'; // Import the Dialog component
//styling of buttons done in styles.js
import styled, { keyframes } from 'styled-components';

const upDown = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Create a styled component for the image with the animation
const AnimatedImage = styled.img`
  width: 100%;
  height: 90%;
  z-index: 5;
  position: relative;
  animation: ${upDown} 3s ease-in-out infinite;
`;

// Create a styled component for the container with flex properties
const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  position: relative;
`;


const Home = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowDialog(true);
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  return (
    <>
      <div className="bg-custom-bg w-full h-80% overflow-auto">
        <Header />
        <img
          src="./dots.png"
          alt="Image Alt Text"
          className="absolute top-0 right-5 w-20 h-18 z-10"
        />
        <section
          id="home"
          className={`flex md:flex-row mt-0 flex-col ${styles.paddingY}`}
        >
          <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
            <div className="flex flex-row ml-20  justify-between items-center w-full">
              <h1 className="flex-1 font-sans text-6xl font-semibold text-[#001E35] max-w-[800px] ss:leading-[100.8px] leading-[75px]" style={{ textShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
                Your Gateway to <br className="sm:block hidden" />{" "}
                <span className="text-gradient">In-Depth News Video</span>
                <br className="sm:block hidden" />
                <span className="text-gradient">Analysis</span>
              </h1>
            </div>
            <p className={"ml-20 font-sans2 font-semibold text-[#001E35] text-lg leading-[40px] max-w-[570px] mt-2"} style={{ textShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
              Unleash the potential of AI to uncover news stories like never before. Our intuitive
              tool lets you gain a deeper understanding of news. Embark on a transformative
              journey to discover the stories hidden beyond the headlines.
            </p>

            {/* Your existing code */}
            <section id="hb" className={`flex md:flex-row mt-50 flex-col ${styles.paddingY}`}>
              <div className='flex justify-center items-center ml-60'>
                <button className={`py-4 px-14 ${styles.HB}`} onClick={handleClick}>GET STARTED</button>
              </div>
            </section>
            {showDialog && !isLoggedIn && (
              <Dialog
                message="Please log in to access this feature!"
                onClose={handleCloseDialog}
              />
            )}
          </div>

          {/* <div className={`flex-1 flex ${styles.flexCenter} mt-0 relative`}> */}
          <Container>
            <AnimatedImage src="./Bg.png" alt="bg" />
          </Container>
          {/* <img src="./Bg.png" alt="bg" className="w-[100%] h-[90%] relative z-[5]" /> */}
          {/* </div> */}
        </section>
        <div className="flex flex-col justify-center items-center ml-20">
          <h1 className="font-sans text-5xl font-semibold text-[#001E35] max-w-[800px] ss:leading-[100.8px] leading-[75px]" style={{ textShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
            Language Based News Audience<br className="sm:block hidden" />{" "}
          </h1>
        </div>
        <PC />
        <br /><br /> <br />
        {/* <div className="flex flex-col justify-center items-center ml-20">
        <h1 className="font-sans text-5xl font-semibold text-[#001E35] max-w-[800px] ss:leading-[100.8px] leading-[75px]" style={{ textShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
          News Channels Connected with Us<br className="sm:block hidden" />{" "}
          <br />
        </h1>
      </div> */}
        <Channels />
        <br /><br />
      </div>

      <Footer />
    </>
  );
};

export default Home;

{/* {isLoggedIn ? ( */ }
//   <>
//     <section id="hb" className={`flex md:flex-row mt-50 flex-col ${styles.paddingY}`}>
//       <div className='flex justify-center items-center ml-60'>
//         <button className={` py-4 px-14  ${styles.HB}`} onClick={handleClick}>GET STARTED</button>
//       </div>

//       {/* <Button className={` py-4 px-14 md:ml-10 ${styles.HB}`}>GENERATE</Button> */}
//     </section>

//     {/* </div> */}
//   </>
// ) : (
//   <>
//     <section id="hb" className={`flex md:flex-row mt-50 flex-col ${styles.paddingY}`}>
//       <div className='flex justify-center items-center ml-60'>
//         <button className={` py-4 px-14  ${styles.HB}`} onClick={handleAlertClick}>GET STARTED</button>
//       </div>

//       {/* <Button className={` py-4 px-14 md:ml-10 ${styles.HB}`}>GENERATE</Button> */}
//     </section>
//   </>
{/* )} */ }