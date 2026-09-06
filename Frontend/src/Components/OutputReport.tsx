function OutputReport() {
  const outputReport = "";
  return (
    <>
      <img
        className="rounded-3 mx-auto d-block"
        src="output.jpeg"
        alt="Output report"
        width={600}
        height={500}
      />
      {outputReport !== "" && <div>Output report content</div>}
    </>
  );
}
export default OutputReport;
