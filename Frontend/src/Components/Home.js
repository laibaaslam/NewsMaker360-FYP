import Header from './Header';
import Footer from './Footer';
import '../App.css';
import styles from '../styles';
import Button from './Button';

const Home = () => {
  return (
    <>
      <div className="bg-custom-bg w-full h-screen overflow-auto">
          <Header />
          <img
            src="./dots.png"
            alt="Image Alt Text"
            className="absolute top-0 right-5 w-20 h-18 z-20"
        />
        <section
          id="home"
          className={`flex md:flex-row mt-0 flex-col ${styles.paddingY}`}
        >
          <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
            <div className="flex flex-row ml-20 justify-between items-center w-full">
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
            <section id="hb" className={`flex md:flex-row mt-50 flex-col ${styles.paddingY}`}>
             <Button className={` py-4 px-14  md:ml-20 ${styles.HB}`}>GET STARTED</Button>
             <Button className={` py-4 px-14 md:ml-10 ${styles.HB}`}>GENERATE</Button>
            </section>
          </div>

          <div className={`flex-1 flex ${styles.flexCenter} mt-0 relative`}>
            <img src="./Bg.png" alt="bg" className="w-[100%] h-[90%] relative z-[5]" />
          </div>
        </section>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
