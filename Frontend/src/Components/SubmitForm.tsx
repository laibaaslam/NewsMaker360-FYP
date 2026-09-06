import { useState } from "react";
import { MouseEvent } from "react";

function InputBody() {
  const [formValid, setFormValid] = useState(false);
  const [formValid1, setFormValid1] = useState(false);

  const handleLinkChange = (event: MouseEvent) => {
    const link = (event.target as HTMLInputElement).value;
    if (link && link.length > 0) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleDropdownChange = (event: MouseEvent) => {
    const option = (event.target as HTMLInputElement).value;
    if (option && option.length > 0) {
      setFormValid1(true);
    } else {
      setFormValid1(false);
    }
  };

  const handleSubmit = (event: MouseEvent) => {
    event.preventDefault();

    if (formValid && formValid1) {
      // Submit the form here
    } else {
      // Display an error message to the user
    }
  };

  return (
    <>
      <div className="input-group justify-content-center">
        <label className="ms-4 fs-6" style={{ fontFamily: "Poppins" }}>
          Enter Link Here :{" "}
        </label>
        <input
          className="rounded-3 w-25 ms-4"
          type="url"
          onClick={handleLinkChange}
        />
        <span></span>

        <select className="rounded-3 w-25 ms-4" onClick={handleDropdownChange}>
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
        <button
          className="btn btn-dark rounded-3 ms-4 w-auto "
          aria-pressed="true"
          type="button"
          disabled={!formValid}
          onClick={handleSubmit}
        >
          GENERATE
        </button>
        <span></span>
      </div>
    </>
  );
}

export default InputBody;
