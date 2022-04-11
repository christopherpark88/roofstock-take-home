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

let testSender = {
  verify: ["delivery"],
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
  verify: ["delivery"],
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
    console.log(`Response ${endpoint}`, responseData);
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
  const [errorFields, setErrorFields] = useState({
    street1: { sender: false, receiver: false },
    street2: { sender: false, receiver: false },
    city: { sender: false, receiver: false },
    state: { sender: false, receiver: false },
    zip: { sender: false, receiver: false },
    country: { sender: false, receiver: false },
    company: { sender: false, receiver: false },
    phone: { sender: false, receiver: false },
    length: false,
    width: false,
    height: false,
    weight: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    street1: { sender: "", receiver: "" },
    street2: { sender: "", receiver: "" },
    city: { sender: "", receiver: "" },
    state: { sender: "", receiver: "" },
    zip: { sender: "", receiver: "" },
    country: { sender: "", receiver: "" },
    company: { sender: "", receiver: "" },
    phone: { sender: "", receiver: "" },
    length: "",
    width: "",
    height: "",
    weight: "",
  });

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
      [key]: parseFloat(e.target.value),
    });
  };

  // Start process to create label upon button click
  const onButtonClick = async () => {
    // Create shipment
    /*     let shipmentObj = await easyPostAPI("Create Shipment", {
      from_address: senderAddress,
      to_address: receiverAddress,
      parcel: parcelDetails,
    }); */

    let fromAddress = await easyPostAPI("Create Address", testSender);
    let toAddress = await easyPostAPI("Create Address", testReceiver);

    let senderVerify = fromAddress.verifications.delivery;
    let receiverVerify = toAddress.verifications.delivery;

    console.log("sender verif", senderVerify);
    console.log("receiver verif", receiverVerify);

    if (senderVerify.success && receiverVerify.success) {
      if (senderVerify.errors.length > 0) {
        senderVerify.errors.map((error) => {
          console.log("sender errors", error);
          setErrorFields({
            ...errorFields,
            [error.field]: {
              sender: true,
              receiver: errorFields[error.field].receiver,
            },
          });
          setHelperTexts({
            ...helperTexts,
            [error.field]: {
              sender: error.message,
              receiver: helperTexts[error.field].receiver,
            },
          });
        });
      }
      if (receiverVerify.errors.length > 0) {
        receiverVerify.errors.map((error) => {
          receiverVerify.errors.map((error) => {
            console.log("receiver errors", error);
            setErrorFields({
              ...errorFields,
              [error.field]: {
                sender: true,
                receiver: errorFields[error.field].receiver,
              },
            });
            setHelperTexts({
              ...helperTexts,
              [error.field]: {
                sender: error.message,
                receiver: helperTexts[error.field].receiver,
              },
            });
          });
        });
      }
    } else {
      if (!senderVerify.success) {
      }
      if (!receiverVerify.success) {
      }
    }

    let shipmentObj = await easyPostAPI("Create Shipment", {
      from_address: fromAddress,
      to_address: toAddress,
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
              error={errorFields.street1.sender}
              helperText={helperTexts.street1.sender}
              fullWidth
              variant="outlined"
              label="Address Line 1"
              onChange={handleAddressChange("street1", true)}
            />
            <InputField
              error={errorFields.street2.sender}
              helperText={helperTexts.street2.sender}
              fullWidth
              variant="outlined"
              label="Address Line 2"
              onChange={handleAddressChange("street2", true)}
            />
            <InputField
              error={errorFields.city.sender}
              helperText={helperTexts.city.sender}
              fullWidth
              variant="outlined"
              label="City"
              onChange={handleAddressChange("city", true)}
            />
            <InputField
              error={errorFields.state.sender}
              helperText={helperTexts.state.sender}
              fullWidth
              variant="outlined"
              label="State"
              onChange={handleAddressChange("state", true)}
            />
            <InputField
              error={errorFields.zip.sender}
              helperText={helperTexts.zip.sender}
              fullWidth
              variant="outlined"
              label="Zip"
              onChange={handleAddressChange("zip", true)}
            />
            <InputField
              error={errorFields.country.sender}
              helperText={helperTexts.country.sender}
              fullWidth
              variant="outlined"
              label="Country"
              onChange={handleAddressChange("country", true)}
            />
            <InputField
              error={errorFields.company.sender}
              helperText={helperTexts.company.sender}
              fullWidth
              variant="outlined"
              label="Company"
              onChange={handleAddressChange("company", true)}
            />
            <InputField
              error={errorFields.phone.sender}
              helperText={helperTexts.phone.sender}
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
            error={errorFields.street1.receiver}
            helperText={helperTexts.street1.receiver}
            fullWidth
            variant="outlined"
            label="Address Line 1"
            onChange={handleAddressChange("street1", false)}
          />
          <InputField
            error={errorFields.street2.receiver}
            helperText={helperTexts.street2.receiver}
            fullWidth
            variant="outlined"
            label="Address Line 2"
            onChange={handleAddressChange("street2", false)}
          />
          <InputField
            error={errorFields.city.receiver}
            helperText={helperTexts.city.receiver}
            fullWidth
            variant="outlined"
            label="City"
            onChange={handleAddressChange("city", false)}
          />
          <InputField
            error={errorFields.state.receiver}
            helperText={helperTexts.state.receiver}
            fullWidth
            variant="outlined"
            label="State"
            onChange={handleAddressChange("state", false)}
          />
          <InputField
            error={errorFields.zip.receiver}
            helperText={helperTexts.zip.receiver}
            fullWidth
            variant="outlined"
            label="Zip"
            onChange={handleAddressChange("zip", false)}
          />
          <InputField
            error={errorFields.country.receiver}
            helperText={helperTexts.country.receiver}
            fullWidth
            variant="outlined"
            label="Country"
            onChange={handleAddressChange("country", false)}
          />
          <InputField
            error={errorFields.company.receiver}
            helperText={helperTexts.company.receiver}
            fullWidth
            variant="outlined"
            label="Company"
            onChange={handleAddressChange("company", false)}
          />
          <InputField
            error={errorFields.phone.receiver}
            helperText={helperTexts.phone.receiver}
            fullWidth
            variant="outlined"
            label="Phone"
            onChange={handleAddressChange("phone", false)}
          />
        </Grid>
        <Grid item xs={4}>
          <strong>Package Attributes</strong>
          <InputField
            error={errorFields.length}
            helperText={helperTexts.length}
            fullWidth
            variant="outlined"
            label="Length (inches)"
            onChange={handleParcelDetailChange("length")}
          />
          <InputField
            error={errorFields.width}
            helperText={helperTexts.width}
            fullWidth
            variant="outlined"
            label="Width (inches)"
            onChange={handleParcelDetailChange("width")}
          />
          <InputField
            error={errorFields.height}
            helperText={helperTexts.height}
            fullWidth
            variant="outlined"
            label="Height (inches)"
            onChange={handleParcelDetailChange("height")}
          />
          <InputField
            error={errorFields.weight}
            helperText={helperTexts.weight}
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
          Generated Label
        </h2>
        {postageLabel ? (
          <a target="_blank" href={postageLabel}>
            {postageLabel}
          </a>
        ) : (
          <div> No labels generated</div>
        )}
      </div>
    </div>
  );
}

export default App;
