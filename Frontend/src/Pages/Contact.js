import Header from '../Components/Header.js';
import Footer from '../Components/Footer.js';
import '../App.css';
import styles from '../styles.js';
import Button from '../Components/Button.js';

const Contact = () => {
    return (
      <>
            <div className="bg-custom-bg w-full h-auto overflow-auto">
            <img
              src="./dots.png"
              alt="Image Alt Text"
              className="absolute top-0 right-5 w-20 h-18 z-20"
          />
              <Header />
              <Footer />
              </div>
        </>
  );
}

export default Contact;