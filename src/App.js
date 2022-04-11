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

const testKey = "EZTKfc531e859f1045758266f73a978f4ef7VZBhjJqsai4JQ4lZ29FI1Q:";

const easyPostAPI = async (endpoint, requestData) => {
  const settings = {
    method: "POST",
    body: JSON.stringify({ endpoint, requestData }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  try {
    const response = await fetch("http://localhost:9000/", settings);
    let responseData = await response.json();
    console.log("response check", responseData);
    return responseData;
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
  const [senderAddress, setSenderAddress] = useState(defaultAddressValues);
  const [receiverAddress, setReceiverAddress] = useState(defaultAddressValues);
  const [parcelDetails, setParcelDetails] = useState("");
  const [postageLabel, setPostageLabel] = useState("");

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

  // Start process to create label upon button click
  const onButtonClick = async () => {
    // With test data (since inputting is a bit tedious)
    let testSender = {
      street1: "417 MONTGOMERY ST",
      street2: "FLOOR 5",
      city: "SAN FRANCISCO",
      state: "CA",
      zip: "94104",
      country: "US",
      company: "EasyPost",
      phone: "415-123-4567",
    };

    let testReceiver = {
      name: "Dr. Steve Brule",
      street1: "179 N Harbor Dr",
      city: "Redondo Beach",
      state: "CA",
      zip: "90277",
      country: "US",
      phone: "4155559999",
    };

    let testParcel = {
      length: 20.2,
      width: 10.9,
      height: 5,
      weight: 65.9,
    };

    // Create shipment

    let shipmentObj = await easyPostAPI("Create Shipment", {
      from_address: testSender,
      to_address: testReceiver,
      parcel: testParcel,
    });

    // Label is found here
    let shipmentPurchase = await easyPostAPI("Buy Shipment", {
      id: shipmentObj.id,
    });
    setPostageLabel(shipmentPurchase.postage_label.label_url);
  };

  useEffect(() => {}, []);

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
          <InputField
            fullWidth
            variant="outlined"
            label="Length (inches)"
            onChange={handleParcelDetailChange("length")}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="Width (inches)"
            onChange={handleParcelDetailChange("width")}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="Height (inches)"
            onChange={handleParcelDetailChange("height")}
          />
          <InputField
            fullWidth
            variant="outlined"
            label="Weight (oz)"
            onChange={handleParcelDetailChange("weight")}
          />
        </Grid>
      </Grid>
      <Button variant="contained" onClick={onButtonClick}>
        Generate Label
      </Button>
      {console.log("postage label", postageLabel)}
      <div>
        <h2 style={{ textDecoration: "underline", margin: "3rem" }}>
          Generated Labels
        </h2>
        <a target="_blank" href={postageLabel}>
          Postage Label
        </a>
      </div>
    </div>
  );
}

export default App;
