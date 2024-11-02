# OrgaMinder Backend

## Description

For the frontend repository, please visit [OrgaMinder Frontend on GitHub](https://github.com/duxtec/orgaminder-frontend).

OrgaMinder Backend is an application designed to facilitate the organization and management of tasks and projects. This system was created with the goal of providing a robust and scalable solution, enabling users to manage their daily activities efficiently and collaboratively.

The backend is responsible for handling essential operations such as user authentication, data storage, and the business logic necessary for manipulating tasks and projects. Utilizing modern technologies and best development practices, OrgaMinder Backend stands out for its performance and security.

## Features

- User Authentication: Secure user registration and authentication processes via Firebase, including JWT-based authentication to protect sensitive information.

- Task Management: Create, read, update, and delete tasks with ease. Users can set due dates and track their status.

- API Integration: RESTful API endpoints for seamless integration with front-end applications or other services, ensuring flexibility and scalability.

- Error Handling: Comprehensive error handling to manage exceptions and provide clear feedback to users, including a dedicated error middleware that provides generic messages to avoid exposing sensitive information.

- Environment Configuration: Easy configuration of environment variables to adapt to different deployment environments.

- Multi-Level User Support: Initial support for multiple user levels, laying the groundwork for future development of administrator and viewer roles. This includes middleware for authentication and authorization.

- Logging System: Integrated logging system to assist in debugging during development and production environments.

- CORS Protection: CORS configuration that allows all requests during development while restricting production requests to the frontend origin.

- API Rate Limiting: Implementation of rate limiting to prevent attacks such as DDoS and brute force.

- Firestore Data Models: Models that work with Firestore for efficient data storage and CRUD operations on tasks.

- Task Access Control: Verification to ensure users can only read, write, edit, and delete tasks they have access to, enhancing data security and integrity.

## Installation

To set up the OrgaMinder Backend project locally, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14.x or later
- **npm**: Version 6.x or later (comes with Node.js)

### Step-by-Step Installation

1. **Clone the Repository**

   Clone the project repository to your local machine using Git:

   ```bash
   git clone https://github.com/duxtec/OrgaMinder-Backend.git
   ```

2. **Navigate to the Project Directory**

   Change into the project directory:

   ```bash
   cd OrgaMinder-Backend
   ```

3. **Install Dependencies**

   Install the required dependencies using npm:

   ```bash
   npm install
   ```

4. **Set Up Environment Variables**

    Inside the config folder, you will find example files named filename.env.example. Use these files as references to create your own files.env files for your specific environment.

5. **Configure Firebase**

   Firebase setup is required for authentication and data storage. Please refer to the [Firebase Configuration](#firebase-configuration) section for detailed instructions.

6. **Start the Development Server**

   After setting up the environment variables and firebase configuration, start the development server:

   ```bash
   npm run dev
   ```

   The server should now be running on `http://localhost:3001`.

### Firebase Configuration

To enable Firebase services in the OrgaMinder Backend, follow these setup steps to configure Firebase for your environment.

1. **Create a Firebase Project**

   First, create a new project in the Firebase console:

   [Firebase Console](https://console.firebase.google.com)

   You can follow Firebase’s official documentation for more details on setting up a project:

   [Firebase Project Setup](https://firebase.google.com/docs/admin/setup)

2. **Automatic Configuration for Google Cloud Environments**

   If the project is running in Google-managed environments like **Cloud Run**, **App Engine**, or **Cloud Functions**, Firebase configuration is handled automatically. For more details, check:

   [Automatic Configuration on Google Cloud](https://firebase.google.com/docs/admin/setup#initialize-sdk)

3. **Manual Configuration for Non-Google Environments**

   For other environments, you’ll need to set up Firebase manually:

   - Generate a Firebase configuration JSON file by navigating to the following location in the Firebase console:

     [Firebase Service Account Settings](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)

   - Download the JSON file containing your service account key. For detailed steps on this process, refer to:

     [Non-Google Environment Setup](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments)

4. **Place the Firebase Configuration File**

   Once you have the JSON file, place it in the following directory of your project:

   ```
   project-directory/src/configs/firebase.json
   ```

   This will allow the application to load the Firebase credentials and connect to Firebase services securely.

After these steps, Firebase should be successfully configured for your project, enabling access to its features like authentication, Firestore, and more.

## Usage

To start using the OrgaMinder Backend, follow these steps for development, building, production, and API documentation access:

### Development
1. Run the development server:
   ```bash
   npm run dev
   ```
   This will start the server in development mode, reloading on changes for streamlined development.

   The server should now be running on `http://localhost:3001`.

### Build
1. To build the project for production:
   ```bash
   npm run build
   ```
   This command compiles and optimizes the application for deployment.

### Production
1. After building, start the server in production mode:
   ```bash
   npm start
   ```
   This will run the application with production-level optimizations, ideal for deployment environments.

   The server should now be running on `http://localhost:8000`.

## API Documentation
1. To explore the API documentation:
   - Access the Swagger interface at `http://localhost:3001/docs` (or replace `localhost:3001` with your server's address if in production). 
   - Here, you can view all available endpoints with detailed information on each.

These instructions should get you up and running with the OrgaMinder Backend!

## Architecture

The OrgaMinder Backend was designed following clean code principles and a clear separation of responsibilities, ensuring scalability and maintainability as the project grows. Here is a brief overview of the main project folders and their roles:

- **app.ts**: The core entry point of the application where server configuration, middleware, and routes are initialized.

- **constants**: Stores application-wide constant values, making configuration adjustments straightforward and centralized.

- **firebase**: Contains Firebase-specific configurations and initializations, handling integrations with Firebase services such as authentication and Firestore.

- **middlewares**: Holds middleware functions that intercept and process requests, including authentication, authorization, error handling, and other request lifecycle controls.

- **routes**: Defines all application endpoints, organizing request handling and routing to different controllers.

- **types**: Contains TypeScript type definitions to enforce data integrity and improve code clarity, ensuring robust type-checking across the application.

- **configs**: Stores configuration files, including environment variable handling and Firebase settings. Provides flexibility for adjusting settings for different environments.

- **errors**: Centralizes custom error classes to define, standardize, and manage application-specific errors.

- **interfaces**: Contains TypeScript interfaces, which provide clear structure definitions for objects and data models, enhancing code consistency.

- **models**: Defines the data models for Firestore collections, allowing for structured CRUD operations and data validation.

- **services**: Contains service classes responsible for business logic, isolating data manipulation and retrieval from controller logic.

- **utils**: Provides utility functions and helpers for common tasks and reusable code snippets, making the main codebase cleaner and more maintainable.

This organized architecture allows the OrgaMinder Backend to be scalable, modular, and easy to maintain as it evolves.

## Contact

If you have any questions, suggestions, or feedback about the OrgaMinder Backend, please feel free to reach out:

- **Email**: [contato@tpereira.com.br](mailto:contato@tpereira.com.br)
- **GitHub**: [Dux Tecnologia](https://github.com/duxtec)
- **Project Repository**: [OrgaMinder Backend on GitHub](https://github.com/duxtec/orgaminder-backend)
- **Frontend Project Repository**: [OrgaMinder Frontend on GitHub](https://github.com/duxtec/orgaminder-frontend)

We appreciate your interest and contributions!

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software in accordance with the license terms. For more details, please refer to the [LICENSE](LICENSE) file included in the repository.