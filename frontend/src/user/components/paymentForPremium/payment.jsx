import React from "react";
import "./payments.css";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { useRadioGroup } from "@mui/material/RadioGroup";
import Stripe_logo from "../../Icons/Stripe_Logo.png";
import Paypal_logo from "../../Icons/Paypal_logo.png";

const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  ".MuiFormControlLabel-label": checked && {
    color: theme.palette.primary.main,
  },
}));

const MyFormControlLabel = ({ value, ...props }) => {
  const radioGroup = useRadioGroup();
  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === value;
  }
  return <StyledFormControlLabel checked={checked} {...props} />;
};
MyFormControlLabel.propTypes = {
  value: PropTypes.any,
};

const PaymentComponent = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;
  // const stripePromise  = loadStripe('pk_test_51OP9g7SJWK76MyVzKQZCMnWse35YbzNshtsWfHKBepI8DCa7HRPXmRziaL9KyRbreTG0AJJtX4uficb7TL1GgPGD00XVntXdk6');
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

  // frontend:
  const handleStripePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/Confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId,
      });
      if (result.error) {
        console.error("Error during checkout:", result.error);
      } else {
        window.location.href = `${process.env.FRONTEND_BASEURL}/success`;
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const handlePaypalPayment = async () => {};
  const handlePayment = () => {
    const selectedPaymentMethod = document.querySelector(
      'input[name="use-radio-group"]:checked'
    ).value;
    if (selectedPaymentMethod === "paypal") {
      handlePaypalPayment();
    } else if (selectedPaymentMethod === "stripe payment") {
      handleStripePayment();
    }
  };

  return (
    <div className="containerStyle">
      <div className="TextStyle">
        <h2>Payments Options :</h2>
        <RadioGroup name="use-radio-group" defaultValue="paypal">
          <FormControlLabel
            value="paypal"
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={Paypal_logo}
                  alt="Paypal Logo"
                  style={{ height: "50px", width: "50px" }}
                />
                <h4 style={{ marginLeft: 5 }}>Paypal </h4>
              </div>
            }
            control={<Radio />}
          />
          <FormControlLabel
            value="stripe payment"
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={Stripe_logo}
                  alt="Stripe Logo"
                  style={{ height: "30px", width: "30px", marginLeft: 5 }}
                />
                <h4 style={{ marginLeft: 5 }}>Stripe Payment</h4>
              </div>
            }
            control={<Radio />}
          />
        </RadioGroup>
        <button className="paymentButton" type="button" onClick={handlePayment}>
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;
