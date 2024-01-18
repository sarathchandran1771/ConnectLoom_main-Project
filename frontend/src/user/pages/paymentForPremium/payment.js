// Payment.js
import React from "react";
import PaymentComponent from "../../components/paymentForPremium/payment";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./payment.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51OP9g7SJWK76MyVzKQZCMnWse35YbzNshtsWfHKBepI8DCa7HRPXmRziaL9KyRbreTG0AJJtX4uficb7TL1GgPGD00XVntXdk6"
);

const Payment = () => {
  return (
    <div>
      <div>
        <div className="editPageSubContainer">
          <div className="homeSidebar">
            <Sidebar />
          </div>
          <div className="editPageRightbar">
            <Elements stripe={stripePromise}>
              <PaymentComponent />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
