# Marketplace Frontend

A modern marketplace application for listings, developed with Next.js and Redux Saga.

## Features

- User authentication (login, register, email verification)
- Listings management (create, update, delete, browse)
- Categories management
- Locations (provinces and districts) management
- Image upload for listings
- Search and filtering capabilities

## Tech Stack

- Next.js 14+ (React framework)
- TypeScript
- Redux Toolkit for state management
- Redux Saga for side effects
- Axios for API requests
- Tailwind CSS for styling

## Backend API

This frontend connects to a NestJS backend API running on `http://localhost:8000` with the following endpoints:

- **Authentication**: `/auth/*` - Register, login, verify email, refresh token, logout
- **User Profile**: `/users/profile` - Get user profile information
- **Listings**: `/listings/*` - CRUD operations for listings, image upload
- **Categories**: `/categories/*` - CRUD operations for categories
- **Locations**: `/locations/*` - CRUD operations for provinces and districts

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure that the backend API is running at `http://localhost:8000`
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## State Management

The application uses Redux Toolkit with Redux Saga for state management:

- **Auth**: Manages user authentication state
- **Listings**: Manages listings data and operations
- **Categories**: Manages categories data and operations
- **Locations**: Manages provinces and districts data and operations

## Project Structure

```
src/
├── app/                  # Main application code
│   ├── components/       # Reusable UI components
│   ├── redux/            # Redux state management
│   │   ├── slices/       # Redux slices for each feature
│   │   ├── sagas/        # Redux Sagas for async operations
│   │   └── store.ts      # Redux store configuration
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
```

## Development

- Run in development mode: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Run linting: `npm run lint`

## License

MIT
