import React, { useState, useEffect } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import Swal from "sweetalert2";

function App() {
  const socket = socketIOClient("https://queue-form-api.herokuapp.com/");
  const [formEnabled, setFormEnabled] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("USERID"))
      localStorage.setItem("USERID", "USER" + new Date().getTime());
    socket.emit("join", { userid: localStorage.getItem("USERID") });
    socket.on("queue_active_member", (data) => {
      console.log(data);
      if (data === localStorage.getItem("USERID")) {
        setFormEnabled(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);
  const handleUnload = (e) => {
    const message = "o/";
    (e || window.event).returnValue = message; //Gecko + IE
    localStorage.removeItem("USERID");
    return message;
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    Swal.fire("We got your request!", "", "success").then(() => {
      window.location.replace("https://www.google.com/");
    });
  };

  const changeURL = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    var x = document.getElementById("option").options[0].text;
    window.location.href = "http://localhost:5000/";
  };

  // eslint-disable-next-line
  const checkChoice = (e) => {};

  return (
    <div className="container">
      <h1 className="brand">
        <select
          style={{
            background: "#FFF",
            padding: 5,
            position: "relative",
            border: 5,
          }}
          onChange={changeURL}
          id="option"
        >
          <option>Please select</option>
          <option value="">Charity</option>
          <option value="http://localhost:5000/">Store</option>
        </select>
        <span style={{ padding: 5 }}>Save Food</span>
      </h1>
      ​
      {!formEnabled ? (
        <div style={{ background: "#FFF", padding: 30 }}>
          <h1 style={{ textTransform: "uppercase" }}>You are in the queue</h1>
        </div>
      ) : (
        <div className="wrapper">
          <div className="company-info">
            <h3>Save Food</h3>
            <ul>
              <li>
                <i className="fa fa-road"></i>Dublin, Ireland
              </li>
              <li>
                <i className="fa fa-phone"></i> (+353) 0852071519
              </li>
              <li>
                <i className="fa fa-envelope"></i> C15339351@mytudublin.ie
              </li>
            </ul>
          </div>
          <div className="contact">
            <h3>Thank you for choosing us!</h3>
            <form id="contact-form" onSubmit={handleSubmitForm}>
              <h2>Exit the Queue</h2>
              <p className="full">
                <button type="submit">Submit</button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
