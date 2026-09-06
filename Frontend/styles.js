const styles = {
    boxWidth: "xl:max-w-[1280px] w-full",
  
    heading2: "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
    // paragraph: "font-sans2 font-semibold text-[#001E35] text-lg leading-[40px]",
  
    flexCenter: "flex justify-center items-center",
    flexStart: "flex justify-center items-start",
    
    APHeading:"text-[#004170] text-4xl text-center font-semibold font-sans mt-16 ",

    AUHeading: "text-[#004170] text-2xl font-semibold font-sans mt-16 ",
    AUP:"text-xl text-[#004170] font-normal font-sans mt-5 text-center  ",
    TI:"text-xl text-[#004170] text-3xl text-center font-semibold font-sans ml-3 mt-5 ",

    HB: "bg-[#001E35] text-white font-semibold font-base font-sans rounded-full hover:bg-indigo-400 duration-500 shadow-2xl ml-3 ms-4 w-auto",
    LB:"bg-[#E0F6FF] text-[#001E35] font-extrabold border border-[#001E35] font-[Poppins] py-2 px-6 mr-10 rounded md:ml-8 hover:bg-indigo-400 duration-500",

    ActionButton:"bg-[#001E35] h-10 w-20 mx-1 text-white font-semibold  font-sans  rounded-full hover:bg-indigo-400 duration-500 shadow-2xl",
 
    Data:"whitespace-nowrap  px-6 py-4 font-2xl font-semibold",

    paddingX: "sm:px-16 px-6",
    paddingY: "sm:py-0 py-6",
    padding: "sm:px-16 px-6 sm:py-12 py-4",
  
    marginX: "sm:mx-16 mx-6",
    marginY: "sm:my-16 my-6",
  };

  export const layout = {
    section: `flex md:flex-row flex-col ${styles.paddingY}`,
    sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,
  
    sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
    sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,
  
    sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
  };
  
  export default styles;

  