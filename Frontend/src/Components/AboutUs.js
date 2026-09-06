import Header from './Header';
import Footer from './Footer';
import '../App.css';
import styles from '../styles';
import Button from './Button';
// add oomph factor to About Us Div
//Correct img positions
//improve overall look of sections

const AU = () => {
  return (
    <>
        <div className="w-full h-full flex flex-col">
          <div className="bg-custom-bg w-full h-auto overflow-auto">
            <Header />
            <img
              src="./dots.png"
              alt="Image Alt Text"
              className="absolute top-0 right-5 w-20 h-18 z-20"
          />
          </div>
          <div className="bg-[#004170] flex flex-col w-full py-20 justify-center items-center" style={{ backgroundImage: 'url("./bg3.jpg")', backgroundSize: 'auto' }}>
          <h1 className="text-white text-4xl font-sans font-semibold mt-30">ABOUT US</h1>
          <h1 className="text-white text-xl font-semibold font-sans2 mt-8">Welcome to Newsmaker 360</h1>
          <h1 className="text-white text-xl font-semibold font-sans2 mt-3">Your Trusted Source for Comprehensive Video Analysis and Insights</h1>
        </div>

          <section className="bg-custom-bg relative flex flex-col w-full justify-center items-center px-60">
            <h1 className={`${styles.AUHeading}`}>WHY NEWSMAKER360?</h1>
            <p className={`${styles.AUP}`}>
            What makes NewsMaker360 unique is our dedication to combining 
            cutting-edge technology with journalistic expertise. We harness 
            the power of Artificial Intelligence and Machine Learning to analyze 
            news content, extract valuable information, and present it to you in a 
            user-friendly format.Our team ensures that you receive accurate and 
            insightful analysis.
            </p>
            <h1 className={`${styles.AUHeading}`}>MEET OUR TEAM</h1>
            <img
              src="./image.png"
              alt="Image Alt Text"
              className="absolute rounded-full top-80 justify-normal left-40 w-40 h-40"
            />
            <section className="bg-[#1E6FB0] mt-10 flex flex-col rounded-3xl w-70% justify-center  py-10">
              <p className={`${styles.TI}`}>Name: Laiba Aslam</p>
              <p className={`${styles.TI}`}>Email: laibaaslam255@gmail.com</p>
              <p className={`${styles.TI}`}>LinkedIn: https://chat.openai.com/c/a0e9e5c6-521f-436d-a773-38c750c405e4</p>
           </section>
            <img
              src="./image.png"
              alt="Image Alt Text"
              className="absolute rounded-full top-42 justify-normal left-40 w-40 h-40"
            />
            <section className="bg-[#1E6FB0] mt-10 flex flex-col rounded-3xl w-70% justify-center  py-10">
              <p className={`${styles.TI}`}>Name: Suniya Ehsan</p>
              <p className={`${styles.TI}`}>Email: suniyaehsan@gmail.com</p>
              <p className={`${styles.TI}`}>LinkedIn: https://chat.openai.com/c/a0e9e5c6-521f-436d-a773-38c750c405e4</p>
           </section>
            <img
              src="./dots.png"
              alt="Image Alt Text"
              className="absolute rounded-full top-550 justify-normal left-40 w-40 h-40 z-20"
            />
            <section className="bg-[#1E6FB0] mt-10 flex flex-col rounded-3xl w-70% justify-center  py-10">
              <p className={`${styles.TI}`}>Name: Haiqa Malik</p>
              <p className={`${styles.TI}`}>Email: haiqamalik@gmail.com</p>
              <p className={`${styles.TI}`}>LinkedIn: https://chat.openai.com/c/a0e9e5c6-521f-436d-a773-38c750c405e4</p>
           </section>
          <h1 className={`${styles.AUHeading}`}>JOIN US ON THIS JOURNEY</h1>
          <p className={`${styles.AUP} mb-20`}>
          We invite you to join us on this exciting journey towards a more informed and
          engaged society. Whether you're a news enthusiast, a concerned citizen or a 
          professional seeking insights, NewsMaker360 is your platform for in-depth News Analysis.
          </p>
          </section>        
        </div>
        <Footer />
        </>
  );
};

export default AU;

