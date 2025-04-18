# AdPlatform - Classified Ads Website

AdPlatform is a modern web application built with Next.js that allows users to create, browse, and manage classified advertisements. This project showcases the implementation of a responsive UI using Tailwind CSS, state management with Redux and Redux-Saga, and form handling with Formik.

## Features

- **User Authentication**: Register and login functionality
- **Browse Advertisements**: View all ads with filtering by category and location
- **Create & Manage Ads**: Post new ads and manage your existing ads
- **Responsive Design**: Works on both desktop and mobile devices
- **Mock Backend**: Includes a local mock API service that simulates backend functionality

## Tech Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **State Management**: Redux, Redux Toolkit, Redux-Saga
- **Form Handling**: Formik with Yup validation
- **Mock API**: Custom implementation with localStorage for persistence

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd adplatform
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js application code
  - `/components`: Reusable UI components
  - `/redux`: Redux store, slices, and sagas
  - `/services`: Mock API service
  - `/types`: TypeScript type definitions
  - `/[page-name]`: Next.js page components

## Usage

### Authentication

- You can register a new account or use the demo account:
  - Email: test@example.com
  - No password required for the demo account in the mock implementation

### Creating Ads

1. Log in to your account
2. Click on "Post an Ad" in the navigation
3. Fill out the form with the details of your item
4. Submit the form to create your ad

### Browsing Ads

- View all ads on the home page or browse page
- Use filters to narrow down ads by category or location

### Managing Your Ads

1. Log in to your account
2. Go to "My Ads" in the user menu
3. Edit or delete your existing ads

## Mock Implementation

This project uses a mock API implementation that stores data in the browser's localStorage. This approach allows the application to function without a real backend server. In a production environment, you would connect to a real API instead.

## License

This project is open source and available under the [MIT License](LICENSE).
