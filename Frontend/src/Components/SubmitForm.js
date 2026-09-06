import { useState } from "react";
import { MouseEvent } from "react";
import styles from "../styles.js";
function InputBody() {
  const [formValid, setFormValid] = useState(false);
  const [formValid1, setFormValid1] = useState(false);
  const [vlink, setvLink] = useState("");

  const handleChange = (event) => {
    setvLink(event.target.value);
  };

  const handleLinkChange = (event) => {
    const link = event.target.value;
    if (link && link.length > 0) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleDropdownChange = (event) => {
    const option = event.target.value;
    if (option && option.length > 0) {
      setFormValid1(true);
    } else {
      setFormValid1(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formValid && formValid1) {
      // Submit the form here
    } else {
      // Display an error message to the user
    }
  };

  return (
    <>
      <div className={"flex flex-col"}>
        <div className={"flex flex-row"}>  
        <text className={" ml-10 font-semibold font-sans2 text-[#001E35] text-s leading-[40px] h-6 w-50  input-group justify-content-center"} style={{ textShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
          Enter Link Here :{" "}
        </text>
        <input
         id="Link"
         type="url"
         value={vlink}
         onChange={handleChange}
          className=" w-30 mt-1 ms-4 border-2 border-black-100 rounded-xl"
          onClick={handleLinkChange}
        />
        </div>
        <span></span>
        <div className={"flex flex-row mt-6"}> 
        <text className={" ml-10 font-semibold font-sans2 text-[#001E35] text-s leading-[40px] h-6 w-50  input-group justify-content-center"} style={{ textShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
          Choose Entity Here :{" "}
        </text>
        <select className=" rounded-xl w-15 ms-4 ml-25 mt-1 border-2 border-grey" onClick={handleDropdownChange}>
          <option value="">Select an Option</option>
          <option value="Select All">Select All</option>
          <option value="Chief Minister Punjab">Chief Minister Punjab</option>
          <option value="Minister Information">Minister Information</option>
          <option value="Minister Industry">Minister Industry</option>
          <option value="Minister Housing">Minister Housing</option>
          <option value="Minister Health">Minister Health</option>
          <option value="Minister Sports">Minister Sports</option>
          <option value="Governor Punjab">Governor Punjab</option>
          <option value="Chief Secetary Punjab">Chief Secetary Punjab</option>
          <option value="Comissioner Lahore">Comissioner Lahore</option>
          <option value="CCPO Lahore">CCPO Lahore</option>
          <option value="IGPR Punjab">IGPR Punjab</option>
        </select>
        </div>
        <span></span>
      </div>
    </>
  );
  }
export default InputBody;
