import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const defaultAddressValues = {
  verify: ["delivery"],
  street1: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  company: "",
  name: "",
  phone: "",
};

/* let testSender = {
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
}; */

let testSender = {
  verify: ["delivery"],
  street1: "",
  street2: "",
  city: "",
  state: "CA",
  zip: "94104",
  country: "US",
  company: "",
  phone: "415-123-4567",
};

let testReceiver = {
  verify: ["delivery"],
  name: "",
  street1: "179 N Harbor Dr",
  city: "Redondo Beach",
  state: "CA",
  zip: "90277",
  country: "US",
  phone: "4155559999",
};

let testParcel = {
  length: 0,
  width: 0,
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
  const [parcelDetails, setParcelDetails] = useState({
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
  });
  const [postageLabel, setPostageLabel] = useState("");
  const [errorFields, setErrorFields] = useState({
    street1: { sender: false, receiver: false },
    street2: { sender: false, receiver: false },
    city: { sender: false, receiver: false },
    state: { sender: false, receiver: false },
    zip: { sender: false, receiver: false },
    country: { sender: false, receiver: false },
    company: { sender: false, receiver: false },
    name: { sender: false, receiver: false },
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
    name: { sender: "", receiver: "" },
    phone: { sender: "", receiver: "" },
    length: "",
    width: "",
    height: "",
    weight: "",
  });
  const [blockGenerate, setBlockGenerate] = useState(true);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [openSnackbar, setOpenSnackBar] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  // Snackbar Component
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleAddressChange = (key, isSender) => (e) => {
    if (isSender) {
      setSenderAddress({
        ...senderAddress,
        [key]: e.target.value,
      });
      setErrorFields({
        ...errorFields,
        [key]: {
          sender: false,
          receiver: errorFields[key].receiver,
        },
      });
      setHelperTexts({
        ...helperTexts,
        [key]: {
          sender: "",
          receiver: helperTexts[key].receiver,
        },
      });
    } else {
      setReceiverAddress({
        ...receiverAddress,
        [key]: e.target.value,
      });
      setErrorFields({
        ...errorFields,
        [key]: {
          sender: errorFields[key].sender,
          receiver: false,
        },
      });
      setHelperTexts({
        ...helperTexts,
        [key]: {
          sender: helperTexts[key].receiver,
          receiver: "",
        },
      });
    }
  };

  const handleParcelDetailChange = (key) => (e) => {
    setParcelDetails({
      ...parcelDetails,
      [key]: parseFloat(e.target.value),
    });
    setErrorFields({
      ...errorFields,
      [key]: false,
    });
    setHelperTexts({
      ...helperTexts,
      [key]: "",
    });
  };

  // Start process to create label upon button click
  const verifyInfo = async () => {
    //Verify no fields are empty
    // Test if any address properties empty

    //Test if parcel props empty
    let emptyFieldFound = false;
    let parcelErrorFields = {};
    let parcelHelperTexts = {};
    let addressErrorFields = {
      street1: { sender: false, receiver: false },
      street2: { sender: false, receiver: false },
      city: { sender: false, receiver: false },
      state: { sender: false, receiver: false },
      zip: { sender: false, receiver: false },
      country: { sender: false, receiver: false },
      company: { sender: false, receiver: false },
      name: { sender: false, receiver: false },
      phone: { sender: false, receiver: false },
    };
    let addressHelperTexts = {
      street1: { sender: "", receiver: "" },
      street2: { sender: "", receiver: "" },
      city: { sender: "", receiver: "" },
      state: { sender: "", receiver: "" },
      zip: { sender: "", receiver: "" },
      country: { sender: "", receiver: "" },
      company: { sender: "", receiver: "" },
      name: { sender: "", receiver: "" },
      phone: { sender: "", receiver: "" },
    };
    let exclude = ["street2", "name", "company"];

    for (const [key, value] of Object.entries(parcelDetails)) {
      if (!value) {
        emptyFieldFound = true;
        parcelErrorFields = {
          ...parcelErrorFields,
          [key]: true,
        };
        parcelHelperTexts = {
          ...parcelHelperTexts,
          [key]: `${key} cannot be empty or 0`,
        };
      }
    }

    for (const [key, value] of Object.entries(senderAddress)) {
      if (!value && !exclude.includes(key)) {
        emptyFieldFound = true;
        addressErrorFields = {
          ...addressErrorFields,
          [key]: { sender: true, receiver: addressErrorFields[key].receiver },
        };
        addressHelperTexts = {
          ...addressHelperTexts,
          [key]: {
            sender: `${key} is required`,
            receiver: addressHelperTexts[key].receiver,
          },
        };
      }
    }

    for (const [key, value] of Object.entries(receiverAddress)) {
      if (!value && !exclude.includes(key)) {
        emptyFieldFound = true;
        addressErrorFields = {
          ...addressErrorFields,
          [key]: { sender: addressErrorFields[key].sender, receiver: true },
        };
        addressHelperTexts = {
          ...addressHelperTexts,
          [key]: {
            sender: addressHelperTexts[key].sender,
            receiver: `${key} is required`,
          },
        };
      }
    }

    setErrorFields({
      ...errorFields,
      ...parcelErrorFields,
      ...addressErrorFields,
    });

    setHelperTexts({
      ...helperTexts,
      ...parcelHelperTexts,
      ...addressHelperTexts,
    });

    if (emptyFieldFound) {
      return;
    }

    let fromAddress = await easyPostAPI("Create Address", senderAddress);
    setSenderAddress(fromAddress);
    let toAddress = await easyPostAPI("Create Address", receiverAddress);
    setReceiverAddress(toAddress);

    let senderVerify = fromAddress.verifications.delivery;
    let receiverVerify = toAddress.verifications.delivery;

    console.log("sender verif", senderVerify);
    console.log("receiver verif", receiverVerify);

    // Verify any errors given by EasyPost
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
        setSnackBarMsg(
          "Minor errors were found when verifying the address. Click Generate Label if you want to continue"
        );
        setOpenSnackBar(true);
        setBlockGenerate(false);
        return;
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
        setSnackBarMsg(
          "Minor errors were found when verifying the address. Click Generate Label if you want to continue"
        );
        setOpenSnackBar(true);
        setBlockGenerate(false);
        return;
      }
      setSnackBarMsg("Verified Successfully! Click Generate Label to proceed.");
      setOpenSnackBar(true);
      setBlockGenerate(false);
    } else {
      if (!senderVerify.success) {
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
        setSnackBarMsg(
          "Major errors found when verifyin address. Please check everything is entered correctly."
        );
        setOpenSnackBar(true);
        setBlockGenerate(true);
      }
      if (!receiverVerify.success) {
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
        setSnackBarMsg(
          "Major errors found when verifyin address. Please check everything is entered correctly."
        );
        setOpenSnackBar(true);
        setBlockGenerate(true);
      }
    }
  };

  const generateLabel = async () => {
    let shipmentObj = await easyPostAPI("Create Shipment", {
      from_address: senderAddress,
      to_address: receiverAddress,
      parcel: parcelDetails,
    });

    // Label is found here
    let shipmentPurchase = await easyPostAPI("Buy Shipment", {
      id: shipmentObj.id,
    });
    setPostageLabel(shipmentPurchase.postage_label.label_url);
    setSnackBarMsg("Successfully generated label!");
    setOpenSnackBar(true);
  };

  useEffect(() => {
    //Testing verification
  }, []);

  return (
    <div className="App">
      <header>
        <h1>EasyPost USPS Label Maker</h1>
      </header>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <div>
            <strong>From Address</strong>
            <form autoComplete="on" id="easypost-info">
              <InputField
                error={errorFields.street1.sender}
                helperText={helperTexts.street1.sender}
                fullWidth
                inputProps={{
                  id: "street1-sender-input",
                  autoComplete: "on",
                }}
                variant="outlined"
                label="*Address Line 1"
                onChange={handleAddressChange("street1", true)}
              />
              <InputField
                error={errorFields.street2.sender}
                helperText={helperTexts.street2.sender}
                fullWidth
                inputProps={{
                  id: "street2-sender-input",
                  autoComplete: "on",
                }}
                variant="outlined"
                label="Address Line 2"
                onChange={handleAddressChange("street2", true)}
              />
              <InputField
                error={errorFields.city.sender}
                helperText={helperTexts.city.sender}
                fullWidth
                inputProps={{
                  id: "city-sender-input",
                  autoComplete: "on",
                }}
                variant="outlined"
                label="*City"
                onChange={handleAddressChange("city", true)}
              />
              <InputField
                error={errorFields.state.sender}
                helperText={helperTexts.state.sender}
                fullWidth
                inputProps={{
                  id: "state-sender-input",
                  autoComplete: "on",
                }}
                variant="outlined"
                label="*State"
                onChange={handleAddressChange("state", true)}
              />
              <InputField
                error={errorFields.zip.sender}
                helperText={helperTexts.zip.sender}
                fullWidth
                inputProps={{
                  id: "zip-sender-input",
                  autoComplete: "on",
                }}
                variant="outlined"
                label="*Zip"
                onChange={handleAddressChange("zip", true)}
              />
              <InputField
                error={errorFields.country.sender}
                helperText={helperTexts.country.sender}
                fullWidth
                inputProps={{
                  id: "country-sender-input",
                  autoComplete: "on",
                }}
                variant="outlined"
                label="*Country"
                onChange={handleAddressChange("country", true)}
              />
              <div>
                <span style={{ display: "inline-flex" }}>
                  <InputField
                    error={errorFields.name.sender}
                    helperText={helperTexts.name.sender}
                    fullWidth
                    inputProps={{
                      id: "name-sender-input",
                      autoComplete: "on",
                    }}
                    variant="outlined"
                    label="*Name"
                    onChange={handleAddressChange("name", true)}
                  />
                </span>
                <span style={{ display: "inline-flex" }}>
                  <InputField
                    error={errorFields.company.sender}
                    helperText={helperTexts.company.sender}
                    fullWidth
                    inputProps={{
                      id: "company-sender-input",
                      autoComplete: "on",
                    }}
                    variant="outlined"
                    label="Company"
                    onChange={handleAddressChange("company", true)}
                  />
                </span>
              </div>

              <InputField
                error={errorFields.phone.sender}
                helperText={helperTexts.phone.sender}
                fullWidth
                inputProps={{
                  id: "phone-sender-input",
                  autoComplete: "on",
                }}
                variant="outlined"
                label="*Phone"
                onChange={handleAddressChange("phone", true)}
              />
            </form>
          </div>
        </Grid>
        <Grid item xs={4}>
          <strong>Destination Address</strong>
          <form autoComplete="on" id="easypost-info">
            <InputField
              error={errorFields.street1.receiver}
              helperText={helperTexts.street1.receiver}
              fullWidth
              inputProps={{
                id: "street1-receiver-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*Address Line 1"
              onChange={handleAddressChange("street1", false)}
            />
            <InputField
              error={errorFields.street2.receiver}
              helperText={helperTexts.street2.receiver}
              fullWidth
              inputProps={{
                id: "street2-receiver-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="Address Line 2"
              onChange={handleAddressChange("street2", false)}
            />
            <InputField
              error={errorFields.city.receiver}
              helperText={helperTexts.city.receiver}
              fullWidth
              inputProps={{
                id: "city-receiver-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*City"
              onChange={handleAddressChange("city", false)}
            />
            <InputField
              error={errorFields.state.receiver}
              helperText={helperTexts.state.receiver}
              fullWidth
              inputProps={{
                id: "state-receiver-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*State"
              onChange={handleAddressChange("state", false)}
            />
            <InputField
              error={errorFields.zip.receiver}
              helperText={helperTexts.zip.receiver}
              fullWidth
              inputProps={{
                id: "zip-receiver-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*Zip"
              onChange={handleAddressChange("zip", false)}
            />
            <InputField
              error={errorFields.country.receiver}
              helperText={helperTexts.country.receiver}
              fullWidth
              inputProps={{
                id: "country-receiver-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*Country"
              onChange={handleAddressChange("country", false)}
            />
            <div>
              <span style={{ display: "inline-flex" }}>
                <InputField
                  error={errorFields.name.receiver}
                  helperText={helperTexts.name.receiver}
                  fullWidth
                  inputProps={{
                    id: "name-receiver-input",
                    autoComplete: "on",
                  }}
                  variant="outlined"
                  label="*Name"
                  onChange={handleAddressChange("name", false)}
                />
              </span>
              <span style={{ display: "inline-flex" }}>
                <InputField
                  error={errorFields.company.receiver}
                  helperText={helperTexts.company.receiver}
                  fullWidth
                  inputProps={{
                    id: "company-receiver-input",
                    autoComplete: "on",
                  }}
                  variant="outlined"
                  label="Company"
                  onChange={handleAddressChange("company", false)}
                />
              </span>
            </div>

            <InputField
              error={errorFields.phone.receiver}
              helperText={helperTexts.phone.receiver}
              fullWidth
              inputProps={{
                id: "phone-receiver-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*Phone"
              onChange={handleAddressChange("phone", false)}
            />
          </form>
        </Grid>
        <Grid item xs={4}>
          <strong>Package Attributes</strong>
          <form autoComplete="on" id="easypost-info">
            <InputField
              error={errorFields.length}
              helperText={helperTexts.length}
              fullWidth
              inputProps={{
                id: "length-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*Length (inches)"
              onChange={handleParcelDetailChange("length")}
            />
            <InputField
              error={errorFields.width}
              helperText={helperTexts.width}
              fullWidth
              inputProps={{
                id: "width-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*Width (inches)"
              onChange={handleParcelDetailChange("width")}
            />
            <InputField
              error={errorFields.height}
              helperText={helperTexts.height}
              fullWidth
              inputProps={{
                id: "height-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*Height (inches)"
              onChange={handleParcelDetailChange("height")}
            />
            <InputField
              error={errorFields.weight}
              helperText={helperTexts.weight}
              fullWidth
              inputProps={{
                id: "weight-input",
                autoComplete: "on",
              }}
              variant="outlined"
              label="*Weight (oz)"
              onChange={handleParcelDetailChange("weight")}
            />
          </form>
        </Grid>
      </Grid>
      <div>
        <Button
          style={{ margin: "1rem" }}
          variant="contained"
          color="secondary"
          onClick={verifyInfo}
          form="easypost-info"
        >
          Verify Address
        </Button>
        <Button
          disabled={blockGenerate}
          style={{ margin: "1rem" }}
          variant="contained"
          onClick={generateLabel}
        >
          Generate Label
        </Button>
      </div>
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
      <Snackbar
        open={openSnackbar}
        onClose={handleClose}
        message={snackBarMsg}
        action={action}
      />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default App;
