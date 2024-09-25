import React from 'react';
import { render, screen } from '@testing-library/react';
import CalculateTax from '../calculate-tax';
import '@testing-library/jest-dom';

jest.mock('../tax-form/TaxForm', () => ({
    TaxForm: function MockTaxForm() {
        return <div data - testid="mock-tax-form" > Mock TaxForm </div>;
    },
}));

jest.mock('../tax-result/TaxResults', () => ({
    TaxResults: function MockTaxResults() {
        return <div data - testid="mock-tax-results" > Mock TaxResults </div>;
    },
}));

describe('CalculateTax', () => {
    it('renders the component with correct title', () => {
        render(<CalculateTax />);
        expect(screen.getByText('Tax Calculator')).toBeInTheDocument();
    });

    it('renders the TaxForm component', () => {
        render(<CalculateTax />);
        expect(screen.getByTestId('mock-tax-form')).toBeInTheDocument();
    });

    it('renders the TaxResults component', () => {
        render(<CalculateTax />);
        expect(screen.getByTestId('mock-tax-results')).toBeInTheDocument();
    });

    it('has the correct layout structure', () => {
        render(<CalculateTax />);
        const mainContainer = screen.getByText('Tax Calculator').closest('div');
        expect(mainContainer).toHaveClass('h-screen flex justify-center items-center flex-col');

        const innerContainer = screen.getByTestId('mock-tax-form').closest('div');
        expect(innerContainer).toHaveClass('max-w-2xl w-full p-4 bg-white shadow-md rounded-lg');
    });
});
