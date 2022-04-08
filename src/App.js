import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [shippingInfo, setShippingInfo] = useState("");

  const testKey = "EZTKfc531e859f1045758266f73a978f4ef7VZBhjJqsai4JQ4lZ29FI1Q:";
  const addressData = {
    street1: "417 MONTGOMERY ST",
    street2: "FLOOR 5",
    city: "SAN FRANCISCO",
    state: "CA",
    zip: "94104",
    country: "US",
    company: "EasyPost",
    phone: "415-123-4567",
  };

  const easyPostAPI = async (url, key, dataToSend) => {
    /*     fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa("EZTKfc531e859f1045758266f73a978f4ef7VZBhjJqsai4JQ4lZ29FI1Q:"),
      },
      body: "address[street1]=417 MONTGOMERY ST&address[street2]=FLOOR 5&address[city]=SAN FRANCISCO&address[state]=CA&address[zip]=94104&address[country]=US&address[company]=EasyPost",
    })
      .then((response) => {
        console.log("response", response.json());
      })
      .then((data) => {
        console.log("data", data);
      })
      .catch((error) => {
        console.log("error", error);
      });
     */

    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(key),
      },
      body: JSON.stringify(addressData),
    };

    const response = await fetch(url, settings);

    let responseData = await response.json();
    setShippingInfo(JSON.stringify(responseData));
    console.log("responsecheck", responseData);
    return responseData;
  };

  useEffect(() => {
    easyPostAPI("/v2/addresses", testKey, addressData);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {shippingInfo}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
