![Interview Manager Logo](public/hire-vision-white.svg)

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Backend Repository](#backend-repository)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Deployment](#deployment)

## Overview

HireVision is a sleek web application designed to manage interview scheduling and tracking. With a user-friendly interface, it allows you to effortlessly create, edit, and view interviews, interviewees, and all related information. Built with cutting-edge technologies like React, Next.js, and Tailwind CSS, this app ensures a seamless experience.

## Live Demo

Check out the live application at: [Live Demo](https://hirevision.vercel.app/)

## Features

- Create, edit, and delete interviews
- Manage interviewees and interviewers
- Calendar view for scheduling
- Multi-language support

## Technologies Used

- **Frontend:**
  - React
  - Next.js
  - Tailwind CSS
  - TypeScript
- **State Management:**
  - Zustand
- **Form Handling:**
  - React Hook Form
  - Zod
- **API:**
  - Axios
- **Utilities:**
  - Date-fns
  - clsx

## Backend Repository

The backend for this project can be found at: [HireVision-REST](https://github.com/ShaneDsouza4/HireVision-REST)

## API Documentation

The Interview Manager Frontend interacts with the backend API to manage interviews and related data. The API documentation can be found in the backend repository.

For detailed API documentation, visit the [API Documentation](https://github.com/ShaneDsouza4/HireVision-REST#api-documentation).

## Project Structure

- **app/**: Main application pages and layouts.
- **components/**: Reusable UI components.
- **features/**: Modules for specific features like calendar and interview management.
- **hooks/**: Custom React hooks.
- **i18n/**: Internationalization setup and files.
- **lib/**: Utility functions and libraries.
- **public/**: Static assets.
- **stores/**: Zustand stores for state management.
- **translations/**: Locale-specific translation files.
- **.env**: Environment variables.
- **.eslintrc.json**: ESLint configuration.
- **.prettierrc**: Prettier configuration.
- **tailwind.config.ts**: Tailwind CSS configuration.
- **tsconfig.json**: TypeScript configuration.

## Setup and Installation

Get started with the Interview Manager Frontend in just a few steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/fwaadahmad1/interview-manager-frontend.git
   cd interview-manager-frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and populate it with the necessary environment variables as specified in the `.env.example` file.

4. **Run the development server:**

   ```sh
   npm run dev
   ```

## Deployment

To deploy the Interview Manager Frontend, follow these steps:

1. **Build the project:**

   ```sh
   npm run build
   ```

2. **Start the production server:**

   ```sh
   npm start
   ```

3. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel.
   - Vercel will automatically detect the Next.js project and configure the deployment settings.
   - Click "Deploy" and wait for the deployment to complete.

For more detailed instructions, refer to the [Vercel documentation](https://vercel.com/docs).

4. **Environment Variables:**
   Ensure that all necessary environment variables are set in the Vercel dashboard under the "Environment Variables" section.
