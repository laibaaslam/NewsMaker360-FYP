import IconButton from "../Components/IconButton.js"
import MailButton from "../Components/MailButton.js"
import Header from '../Components/Header.js';
import Footer from '../Components/Footer.js';
import { FaLinkedin } from "react-icons/fa/index.esm.js"
import { FaEnvelope } from "react-icons/fa/index.esm.js";

import '../App.css';
import styles from '../styles.js';
//styling done in styles.js

const AU = () => {
  return (
    <>
      <div className="bg-custom-bg w-full h-auto relative z-50">
        <Header />
        <img
          src="/dots.png"
          alt=""
          className="absolute top-0 right-5 w-20 h-18 z-0 pointer-events-none"
        />
      </div>
      <div className="bg-[#004170] relative z-0 flex flex-col w-full py-20 justify-center items-center" style={{ backgroundImage: 'url("/bg1.jpg")', backgroundSize: 'cover' }}>
        <h1 className="text-white text-4xl font-sans font-semibold mt-30">ABOUT US</h1>
        <h1 className="text-white text-xl font-semibold font-sans2 mt-10">Learn More About Newsmaker360</h1>
        <h1 className="text-white text-xl font-semibold font-sans2 mt-3">& The Team Behind It</h1>
      </div>

      <section className="bg-custom-bg relative flex flex-col w-full justify-center items-center px-60">
        <h1 id='AUH' className={`${styles.AUHeading}`}>WHY NEWSMAKER360?</h1>
        <p className={`${styles.AUP}`}>
          NewsMaker360 turns YouTube news clips into clear, structured analysis.
          We use Artificial Intelligence and Machine Learning to transcribe speech,
          generate an English summary, highlight key entities with frequency, and
          add contextual insight — then deliver it as a downloadable PDF. Built by
          Haiqa Rauf, Laiba Aslam, and Suniya Ehsan, the platform helps you
          understand a story in minutes, not hours.
        </p>
        <h1 id='AUH' className={`${styles.AUHeading}`}> OUR TEAM</h1>
        <div className='flex flex-row'>
          <section className='pr-20'>
            <img
              src="/image.png"
              alt="Haiqa Rauf"
              className="rounded-full object-cover w-40 h-40 mt-10 shadow-xl"
            />
            <p className={`${styles.TI}`}>Haiqa Rauf</p>
            <div className='flex flex-row p-0 ml-11 mt-2'>
              <div className="flex justify-centre items-center gap-0.5">
                <IconButton text="Haiqa" color="bg-blue-500" link={'https://www.linkedin.com/in/haiqa-abdul-rauf-bb41812b9'}>
                  <FaLinkedin size={20} />
                </IconButton>
                <MailButton text="haiqarauf" color="bg-red-600">
                  <FaEnvelope size={20} />
                </MailButton>
              </div>
            </div>
          </section>
          <section className='pr-10'>
            <img
              src="/image.png"
              alt="Laiba Aslam"
              className="rounded-full object-cover w-40 h-40 mt-10 shadow-xl"
            />
            <p className={`${styles.TI}`}>Laiba Aslam</p>
            <div className='flex flex-row p-0 ml-11 mt-2'>
              <div className="flex justify-centre items-center gap-0.5">
                <IconButton text="laiba" color="bg-blue-500" link={'https://www.linkedin.com/in/laiba-aslam-401aab243'}>
                  <FaLinkedin size={20} />
                </IconButton>
                <MailButton
                  text="laibaaslam"
                  color="bg-red-600"
                  link={'laibaaslam255@gmail.com'}
                >
                  <FaEnvelope size={20} />
                </MailButton>
              </div>
            </div>
          </section>
          <section className='pl-7'>
            <img
              src="/image.png"
              alt="Suniya Ehsan"
              className="rounded-full object-cover w-40 h-40 mt-10 shadow-xl"
            />
            <p className={`${styles.TI}`}>Suniya Ehsan</p>
            <div className='flex flex-row p-0 ml-11 mt-2'>
              <div className="flex justify-centre items-center gap-0.5">
                <IconButton text="Suniya" color="bg-blue-500" link={'https://www.linkedin.com/in/suniya-ehsan-4a0208250'}>
                  <FaLinkedin size={20} />
                </IconButton>
                <MailButton
                  text="suniyaehsan"
                  color="bg-red-600"
                  link={'suniyaehsan@gmail.com'}
                >
                  <FaEnvelope size={20} />
                </MailButton>
              </div>
            </div>
          </section>
        </div >
        <h1 id='AUH' className={`${styles.AUHeading}`}>JOIN US ON THIS JOURNEY</h1>
        <p className={`${styles.AUP} mb-20`}>
          We invite you to join us on this exciting journey towards a more informed and
          engaged society. Whether you're a news enthusiast, a concerned citizen or a
          professional seeking insights, NewsMaker360 is your platform for in-depth News Analysis.
        </p>
      </section >
      < Footer />
    </>
  );
};

export default AU;

