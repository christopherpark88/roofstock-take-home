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

const easyPostAPI = async (method, url, dataToSend) => {
  console.log("datatosend", dataToSend);
  const settings = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(testKey),
    },
    body: JSON.stringify(dataToSend),
  };

  try {
    const response = await fetch(url, settings);
    let responseData = await response.json();
    console.log("responsecheck", responseData);
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
      street1: "200 Alfred Drive",
      street2: "",
      city: "BROOKLYN",
      state: "NY",
      zip: "11212",
      country: "US",
      company: "EasyPost",
      phone: "418-281-1284",
    };

    let testParcel = {
      length: 20.2,
      width: 10.9,
      height: 5,
      weight: 65.9,
    };

    let fromAddress = await easyPostAPI("POST", "/v2/addresses", testSender);
    let toAddress = await easyPostAPI("POST", "v2/addresses", testReceiver);
    let parcelAttributes = await easyPostAPI("POST", "v2/parcels", testParcel);

    let shipmentData = {
      from_address: {
        street1: "417 MONTGOMERY ST",
        street2: "FLOOR 5",
        city: "SAN FRANCISCO",
        state: "CA",
        zip: "94104",
        country: "US",
        company: "EasyPost",
        phone: "415-123-4567",
      },
      to_address: {
        name: "Dr. Steve Brule",
        street1: "179 N Harbor Dr",
        city: "Redondo Beach",
        state: "CA",
        zip: "90277",
        country: "US",
        phone: "4155559999",
      },
      parcel: {
        length: 8,
        width: 5,
        height: 5,
        weight: 5,
      },
    };
    // Create Shipment
    let shipmentResponse = await easyPostAPI(
      "POST",
      "v2/shipments",
      shipmentData
    );

    /*     let fromAddress = await easyPostAPI("/v2/addresses", senderAddress);
    let toAddress = await easyPostAPI("v2/addresses", receiverAddress);
    let parcelAttributes = await easyPostAPI("v2/parcels", parcelDetails); */
    //console.log("parcel_response", parcelAttributes);
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
            Put optional customs info here
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
          Remember to put customs info here
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
        {console.log("parceldetails", parcelDetails)}
      </Grid>
      <Button variant="contained" onClick={onButtonClick}>
        Generate Label
      </Button>
    </div>
  );
}

export default App;
