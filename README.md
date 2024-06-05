# CTM API Scenarios Testing

This project contains automated tests for various API error scenarios using Mocha, Chai, Axios, and Mochawesome.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 14.x or later)
- npm (version 6.x or later)

## Setup

1. Clone the repository to your local machine and navigate to the project directory:
    git clone <repository_url>
    cd <project_directory>

2. Install the required dependencies:
    npm install

3. Create a `config.js` file in the root directory and configure the API endpoints for different environments

## Running the Tests

To run the tests and generate a report, follow these steps:

1. Execute the test command:
    - On Dev env
        npm test
    - On UAT env
        npm run test:uat
    - On Prod env
        npm run test:prod

2. This command will run all the tests and generate an HTML report using `mochawesome`.

## Viewing the Report

1. After the tests have completed, you can find the test report in the `mochawesome-report` directory.

2. Open the `mochawesome-report` directory and look for the `mochawesome.html` file.

3. Open the `mochawesome.html` file in your web browser to view the detailed test report.

## Project Structure

project-root/
│
├── tests/
│   └── testCases.js       # Contains the test cases for the API scenarios
├── config.js              # Config API endpoint
├── package.json           # List dependencies and scripts
├── README.md              # Information about setting up and running the project

## Adding New Test Cases

To add new test cases, you can follow these steps:

1. Open the `tests/testCases.js` file.
2. Add your new error scenario to the `errorScenarios` object.
3. Add the corresponding request modification logic in the `getDefaultRequestData` function if necessary.
4. Generate the new test cases by running the tests.

## Troubleshooting

If you encounter any issues while setting up or running the tests, ensure that you have the correct versions of Node.js and npm installed. You can also check the `mochawesome-report` directory for logs and error messages that might help diagnose the problem.

---