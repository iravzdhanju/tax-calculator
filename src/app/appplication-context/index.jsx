import React from "react";
import { TaxProvider } from "../context/FormContext";
import { ToastContainer } from "react-toastify";
import CalculateTax from "../components/calculate-tax";
import "react-toastify/dist/ReactToastify.css";
import Providers from "../providers/Providers";

export default function ApplicationContext() {
  return (
    <Providers>
      <TaxProvider>
        <CalculateTax />
        <ToastContainer />
      </TaxProvider>
    </Providers>
  );
}
