// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react";
import { TaxForm } from "./TaxForm";

// Mock the useTax hook
jest.mock("@/app/context/FormContext", () => ({
  useTax: () => ({
    income: "",
    setIncome: jest.fn(),
    taxYear: "2022",
    setTaxYear: jest.fn(),
    loading: false,
    calculateTax: jest.fn(),
  }),
}));

describe("TaxForm", () => {
  it("renders correctly", () => {
    render(<TaxForm />);

    expect(screen.getByLabelText(/Annual Income:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tax Year:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Calculate Tax/i })).toBeInTheDocument();
  });

  it("allows input of income", () => {
    render(<TaxForm />);

    const incomeInput = screen.getByLabelText(/Annual Income:/i) as HTMLInputElement;
    fireEvent.change(incomeInput, { target: { value: "" } });
    expect(incomeInput.value).toBe("");
  });

  it("allows selection of tax year", () => {
    render(<TaxForm />);

    const taxYearSelect = screen.getByLabelText(/Tax Year:/i) as HTMLSelectElement;
    fireEvent.change(taxYearSelect, { target: { value: "2022" } });
    expect(taxYearSelect.value).toBe("2022");
  });

  it("disables button when loading", () => {
    jest.spyOn(require("@/app/context/FormContext"), "useTax").mockReturnValue({
      income: "",
      setIncome: jest.fn(),
      taxYear: "2022",
      setTaxYear: jest.fn(),
      loading: true,
      calculateTax: jest.fn(),
    });

    render(<TaxForm />);

    const button = screen.getByRole("button", { name: /Calculating.../i });
    expect(button).toBeDisabled();
  });
});
