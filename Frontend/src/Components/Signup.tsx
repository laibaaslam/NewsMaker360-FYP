import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Signup.css";
function SignUp() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button
        variant="dark"
        onClick={handleShow}
        style={{ width: "80px", fontFamily: "Poppins" }}
      >
        SignUp
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
        className="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section
            className="pt-5 pb-5 mt-0 align-items-center d-flex bg-dark w-100"
            style={{
              minHeight: "100",
              backgroundSize: "cover",
              backgroundImage:
                "url(https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1920&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=c0d43804e2c7c93143fe8ff65398c8e9);",
            }}
          >
            <div className="container-fluid">
              <div className="row  justify-content-center align-items-center d-flex-row text-center h-100">
                <div className="   h-50 ">
                  <div className="card shadow">
                    <div className="card-body mx-auto">
                      <h4 className="card-title mt-3 text-center">
                        Create Account
                      </h4>
                      <p className="text-center">
                        Get started with your free account
                      </p>

                      <form>
                        <div className="form-group input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              {" "}
                              <i className="fa fa-user"></i>{" "}
                            </span>
                          </div>
                          <input
                            name=""
                            className="form-control"
                            placeholder="Full name"
                            type="text"
                          ></input>
                        </div>
                        <div className="form-group input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              {" "}
                              <i className="fa fa-envelope"></i>{" "}
                            </span>
                          </div>
                          <input
                            name=""
                            className="form-control"
                            placeholder="Email address"
                            type="email"
                          ></input>
                        </div>
                        <div className="form-group input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              {" "}
                              <i className="fa fa-lock"></i>{" "}
                            </span>
                          </div>
                          <input
                            className="form-control"
                            placeholder="Create password"
                            type="password"
                          ></input>
                        </div>
                        <div className="form-group input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              {" "}
                              <i className="fa fa-lock"></i>{" "}
                            </span>
                          </div>
                          <input
                            className="form-control"
                            placeholder="Repeat password"
                            type="password"
                          ></input>
                        </div>
                        <div className="form-group">
                          <br />
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                          >
                            {" "}
                            Create Account{" "}
                          </button>
                        </div>
                        <br />
                        <p className="text-center">
                          Have an account?
                          <a href="">Log In</a>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SignUp;
