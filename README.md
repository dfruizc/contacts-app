# ContactsApp

Angular application for managing contacts with CRUD operations, using Reactive Forms and localStorage for data persistence.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10.

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Verify installation

```bash
node --version   # Should be v18.x or higher
npm --version    # Should be 9.x or higher
```

## Installation

1. Clone the repository:
```bash
# Using SSH (requires SSH key setup)
git clone git@github.com:dfruizc/contacts-app.git

# Or using HTTPS
git clone https://github.com/dfruizc/contacts-app.git

cd contacts-app
```

2. Install dependencies:
```bash
npm install
```

## Development server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Project Structure

```
contacts-app/
├── src/
│   ├── app/
│   │   ├── components/      # Reusable components
│   │   │   ├── contact-list/
│   │   │   ├── contact-item/
│   │   │   └── contact-form/
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── services/         # Business logic
│   │   └── app.routes.ts     # Routing configuration
│   └── main.ts
├── public/
│   └── contacts.json        # Initial data (simulates API)
└── package.json
```

## Features

- ✅ View contacts list
- ✅ Create new contacts
- ✅ Edit existing contacts
- ✅ Delete contacts
- ✅ Multiple phone numbers per contact
- ✅ Form validation with Reactive Forms
- ✅ Data persistence with localStorage
- ✅ Load initial data from JSON file

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
