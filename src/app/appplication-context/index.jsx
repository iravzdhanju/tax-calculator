import React from "react";
import { TaxProvider } from "../context/FormContext";
import { ToastContainer } from "react-toastify";
import CalculateTax from "../components/calculate-tax";
import "react-toastify/dist/ReactToastify.css";

export default function ApplicationContext() {
  return (
    <TaxProvider>
      <CalculateTax />
      <ToastContainer />
    </TaxProvider>
  );
}
