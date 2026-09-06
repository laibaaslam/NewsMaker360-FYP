function GenerateBox() {
  return (
    <>
      <div className="input-group justify-content-center">
        <label className="ms-4 fs-6" style={{ fontFamily: "Poppins" }}>
          Enter Link Here :{" "}
        </label>
        <input className="rounded-3 w-50 ms-4" type="url"></input>
        <span></span>
        <button
          className="btn btn-dark rounded-3 ms-4 w-auto"
          aria-pressed="true"
          type="button"
        >
          GENERATE
        </button>
      </div>
    </>
  );
}

export default GenerateBox;
