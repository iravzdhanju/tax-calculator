// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaxResults } from './TaxResults';
import { useTax } from "@/app/context/FormContext";

// Mock the useTax hook
jest.mock("@/app/context/FormContext", () => ({
    useTax: jest.fn(),
}));

describe('TaxResults', () => {
    it('renders nothing when result is null', () => {
        (useTax as jest.Mock).mockReturnValue({ result: null });
        const { container } = render(
            <TaxResults/>
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders tax results correctly when result is available', () => {
        const mockResult = {
            totalFederalTax: 10000,
            marginalRate: 22,
            effectiveTaxRate: 15,
            totalIncomeAfterTax: 90000,
        };

        (useTax as jest.Mock).mockReturnValue({ result: mockResult });

        render(<TaxResults/>);

        // Check if the heading is rendered
        expect(screen.getByText('Results:')).toBeInTheDocument();

        // Check if all result values are rendered correctly
        expect(screen.getByText('$10000')).toBeInTheDocument();
        expect(screen.getByText('22%')).toBeInTheDocument();
        expect(screen.getByText('15%')).toBeInTheDocument();
        expect(screen.getByText('$90000')).toBeInTheDocument();

        // Check if all labels are rendered
        expect(screen.getByText(/Total Federal Tax:/i)).toBeInTheDocument();
        expect(screen.getByText(/Marginal Tax Rate:/i)).toBeInTheDocument();
        expect(screen.getByText(/Effective Tax Rate:/i)).toBeInTheDocument();
        expect(screen.getByText(/Income After Tax:/i)).toBeInTheDocument();
    });
});