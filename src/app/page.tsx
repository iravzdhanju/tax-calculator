"use client";
import React from "react";
import Providers from "./providers/Providers";
import CalculateTax from "./components/calculate-tax";

export default function Home() {
  return (
    <React.Fragment>
      <Providers>
        <CalculateTax />
      </Providers>
    </React.Fragment>
  );
}
