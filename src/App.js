import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styled from "styled-components";

const defaultAddressValues = {
  street1: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  company: "",
  phone: "",
};

const testKey = "";
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
  const settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(key),
    },
    body: JSON.stringify(dataToSend),
  };

  try {
    const response = await fetch(url, settings);
    let responseData = await response.json();
    return responseData;
    console.log("responsecheck", responseData);
  } catch (e) {
    console.log("error in updating response", e);
  }
};

const InputField = styled(TextField)`
  && {
    margin: 0.5rem;
  }
`;

function App() {
  const [shippingInfo, setShippingInfo] = useState("");
  const [senderAddress, setSenderAddress] = useState(defaultAddressValues);
  const [receiverAddress, setReceiverAddress] = useState(defaultAddressValues);
  const [parcelDetails, setParcelDetails] = useState("");

  const handleAddressChange = (key, isSender) => (e) => {
    if (isSender) {
      setSenderAddress({
        ...senderAddress,
        [key]: e.target.value,
      });
    } else {
      setReceiverAddress({
        ...receiverAddress,
        [key]: e.target.value,
      });
    }
  };

  const handleParcelDetailChange = (key) => (e) => {
    setParcelDetails({
      ...parcelDetails,
      [key]: e.target.value,
    });
  };

  const onButtonClick = () => {
    //let fromAddress = await easyPostAPI("/v2/addresses", testKey, senderAddress);
    //let toAddress = await easyPostAPI("v2/addresses", testKey, receiverAddress)
  };

  useEffect(() => {
    //easyPostAPI("/v2/addresses", testKey, addressData);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>EasyPost Label Maker</h1>
      </header>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <div>
            <strong>From Address</strong>
            <InputField
              fullWidth
              variant="outlined"
              label="Address Line 1"
              onChange={handleAddressChange("street1", true)}
            />
            <InputField
              fullWidth
              variant="outlined"
              label="Address Line 2"
              onChange={handleAddressChange("street2", true)}
            />
            <InputField
              fullWidth
              variant="outlined"
              label="City"
              onChange={handleAddressChange("city", true)}
            />
            <InputField
              fullWidth
              variant="outlined"
              label="State"
              onChange={handleAddressChange("state", true)}
            />
            <InputField
              fullWidth
              variant="outlined"
              label="Zip"
              onChange={handleAddressChange("zip", true)}
            />
            <InputField
              fullWidth
              variant="outlined"
              label="Country"
              onChange={handleAddressChange("country", true)}
            />
            <InputField
              fullWidth
              variant="outlined"
              label="Company"
              onChange={handleAddressChange("company", true)}
            />
            <InputField
              fullWidth
              variant="outlined"
              label="Phone"
              onChange={handleAddressChange("phone", true)}
            />
          </div>
        </Grid>
        <Grid item xs={4}>
          <strong>Destination Address</strong>
          <InputField
            fullWidth
            variant="outlined"
            label="Address Line 1"
            onChange={handleAddressChange("street1", false)}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="Address Line 2"
            onChange={handleAddressChange("street2", false)}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="City"
            onChange={handleAddressChange("city", false)}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="State"
            onChange={handleAddressChange("state", false)}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="Zip"
            onChange={handleAddressChange("zip", false)}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="Country"
            onChange={handleAddressChange("country", false)}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="Company"
            onChange={handleAddressChange("company", false)}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="Phone"
            onChange={handleAddressChange("phone", false)}
          />
        </Grid>
        <Grid item xs={4}>
          <strong>Package Attributes</strong>
        </Grid>
      </Grid>
      <Button variant="contained" onClick={onButtonClick}>
        Generate Label
      </Button>
    </div>
  );
}

export default App;
