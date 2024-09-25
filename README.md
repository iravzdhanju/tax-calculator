# Tax Calculator

This is a Next.js-based tax calculator application that allows users to calculate their federal tax based on their annual income and selected tax year.

## Features

- Calculate federal tax based on annual income
- Select tax year (2019-2022)
- View detailed tax results, including:
  - Total federal tax
  - Marginal tax rate
  - Effective tax rate
  - Income after tax

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm or yarn

### Installation

1.  Clone the repository:

        git clone https://github.com/your-username/tax-calculator.git

        cd tax-calculator

2.  Install dependencies:

        npm install
        or
        yarn install

3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add the following:

            NEXT_PUBLIC_API_URL=your_api_url_here

4.  Start the development server:
    npm run dev
    or
    yarn dev
5.  Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

### Usage

1. Enter your annual income in the "Annual Income" field.
2. Select the tax year from the dropdown menu.
3. Click the "Calculate Tax" button to view the results.

## Testing

Run the test suite with:
npm test
or
yarn test

To run tests in watch mode:
npm run test:watch
or
yarn test:watch

## Building for Production

To create a production build:
npm run build
or
yarn build

Then start the production server:
npm start
or
yarn start

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Jest and React Testing Library for testing
- React Toastify for notifications

## Project Structure

- `/src/app`: Main application code
  - `/components`: React components
  - `/context`: React context for state management
  - `/utils`: Utility functions and types

## If you have any issues feel free to contact me on my email

## If you have any Queries raise a query on my website
