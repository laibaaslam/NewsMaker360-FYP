<style>
  @import
  url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
</style>;
function PastActivites() {
  return (
    <>
      <div className="container rounded-3 bg-white">
        <div className="row">
          <div className="col">
            <br></br>
            <img
              className="rounded-3 mx-auto d-block"
              src="Act1.gif"
              width={200}
              height={150}
            ></img>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              2Hrs Ago
            </p>
          </div>
          <div className="col">
            <br></br>
            <img
              className="rounded-3 mx-auto d-block"
              src="Act2.jpeg"
              width={200}
              height={150}
            ></img>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              4 Days Ago
            </p>
          </div>
          <div className="col">
            <br></br>
            <img
              className="rounded-3 mx-auto d-block"
              src="Act3.jpeg"
              width={200}
              height={150}
            ></img>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              5 Days Ago
            </p>
          </div>
          <div className="col">
            <br></br>
            <img
              className="rounded-3 mx-auto d-block"
              src="Act4.gif"
              width={200}
              height={150}
            ></img>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              6 Days Ago
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PastActivites;
