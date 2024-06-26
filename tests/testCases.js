const moment = require('moment');
const axios = require('axios');
const { expect } = require('chai');
const addContext = require('mochawesome/addContext');
const config = require('../config');

// Define acceptable response time in milliseconds
const ACCEPTABLE_RESPONSE_TIME = 12000; // 9 seconds

// Define test cases array
let testCases = [];

// Function to add test case
function addTestCase(description, request, expectedStatusCode, expectedErrorMessage = null) {
    testCases.push({
        description: description,
        request: request,
        expectedStatusCode: expectedStatusCode,
        expectedErrorMessage: expectedErrorMessage
    });
}

// Error scenarios and expected error messages
const errorScenarios = {
    "missingquoteTransactionId": {
        errorCode: "ER_QUOTE_TXN_ID_MISSING",
        errorMessage: "Quote transaction Id field missing"
    },
    "invalidPolicyType": {
        errorCode: "ER_POLICY_TYPE_INVALID",
        errorMessage: "Invalid policy type"
    },
    "missingPolicyType": {
        errorCode: "ER_POLICY_TYPE_MISSING",
        errorMessage: "Policy type field missing"
    },
    "invalidtravellerAges": {
        errorCode: "ER_TR_AGE_INVALID",
        errorMessage: "Invalid traveller age"
    },
    "invalidtravellerAges greater than 110": {
        errorCode: "ER_TR_AGE_INVALID",
        errorMessage: "Invalid traveller age"
    },
    "invalidtravellerAges less than 18": {
        errorCode: "ER_TR_AGE_INVALID",
        errorMessage: "Invalid traveller age"
    },
    "missingTravellerAges": {
        errorCode: "ER_TR_AGE_MISSING",
        errorMessage: "Traveller ages field missing"
    },
    "emptyTravellerAges": {
        errorCode: "ER_TR_AGE_EMPTY",
        errorMessage: "Traveller ages must not be empty"
    },
    "exceedingMaxTravellers": {
        errorCode: "ER_TR_AGE_MAX",
        errorMessage: "The maximum number of travellers is 2"
    },
    "NotAnArrayTravellerAge": {
        errorCode: "ER_TR_AGE_ARR",
        errorMessage: "Traveller ages must be provided as an array"
    },
    "invalidChildAge": {
        errorCode: "ER_TR_CHILD_AGE_INVALID",
        errorMessage: "Invalid child age"
    },
    "invalidChildAge greater than equal 25": {
        errorCode: "ER_TR_CHILD_AGE_INVALID",
        errorMessage: "Invalid child age"
    },
	"exceedingMaxDependents": {
        errorCode: "ER_TR_CHILD_AGE_MAX",
        errorMessage: "The maximum number of dependents is 6"
    },
    "NotAnArrayTravellerChildAge": {
        errorCode: "ER_TR_CHILD_AGE_ARR",
        errorMessage: "Traveller child ages must be provided as an array"
    },
    "invalidEmailFormat": {
        errorCode: "ER_EMAIL_ADDRESS_INVALID",
        errorMessage: "Invalid email address"
    },
    "missingSingleTripDetails": {
        errorCode: "ER_SINGLE_TRIP_DETAILS_MISSING",
        errorMessage: "Single trip details field missing"
    },
    "invalidFormatStartDate": {
        errorCode: "ER_FROM_DATE_INVALID",
        errorMessage: "Invalid start date"
    },
    "invalidFormatEndDate": {
        errorCode: "ER_TO_DATE_INVALID",
        errorMessage: "Invalid end date"
    },
    "The end date is smaller than the start date": {
        errorCode: "ER_TO_DATE_INVALID",
        errorMessage: "Invalid end date"
    },
    "The start date is the past days": {
        errorCode: "ER_FROM_DATE_INVALID",
        errorMessage: "Invalid start date"
    },
    "The start date is greater than equal 365 days from today": {
        errorCode: "ER_FROM_DATE_INVALID",
        errorMessage: "Invalid start date"
    },
    /*"The end date is greater than equal 365 days from the start date": {
        errorCode: "ER_TO_DATE_INVALID",
        errorMessage: "Invalid end date"
    },*/
    "missingAnnualCoverDetails": {
        errorCode: "ER_ANNUAL_COVER_DETAILS_MISSING",
        errorMessage: "Annual cover details field missing"
    },
    "invalidMaxTripDuration": {
        errorCode: "ER_MAX_TRIP_DURATION",
        errorMessage: "Invalid max trip duration"
    },
    "unknownDestination": {
        errorCode: "ER_UNKN_DEST",
        errorMessage: "Unknown destination received"
    },
    "destination both Domestic and International": {
        errorCode: "ER_UNKN_DEST",
        errorMessage: "Unknown destination received"
    },
    "unsafeDestination": {
        errorCode: "ER_UNKN_DEST",
        errorMessage: "Unknown destination received"
    },           
    "noProductDestination": {
        errorCode: "ER_UNKN_DEST",
        errorMessage: "Unknown destination received"
    },
    "missingExtraCover": {
        errorCode: "ER_EXTRA_COVER_MISSING",
        errorMessage: "Extra cover field missing"
    },
	"invalidExtraCover": {
        errorCode: "ER_EXTRA_COVER_INVALID",
        errorMessage: "Invalid extra cover"
    },
	"missingCruisingField": {
        errorCode: "ER_CRUISING_MISSING",
        errorMessage: "Cruising field missing"
    },
	"missingSnowSportsField": {
        errorCode: "ER_SNOW_SPORTS_MISSING",
        errorMessage: "Snow sports field missing"
    },
    "missingCoverLevels": {
        errorCode: "ER_COVER_LEVELS_MISSING",
        errorMessage: "Cover levels field missing"
    },
	"missingTripCancellation": {
        errorCode: "ER_TRIP_CANX_MISSING",
        errorMessage: "Trip cancellation field missing"
    },
	"invalidTripCancellation": {
        errorCode: "ER_TRIP_CANX_INVALID",
        errorMessage: "Invalid trip cancellation"
    },
	"missingLuggage": {
        errorCode: "ER_LUGGAGE_MISSING",
        errorMessage: "Luggage field missing"
    },
	"invalidLuggage": {
        errorCode: "ER_LUGGAGE_INVALID",
        errorMessage: "Invalid luggage"
    },
	"missingExcess": {
        errorCode: "ER_EXCESS_MISSING",
        errorMessage: "Excess field missing"
    },
	"invalidExcess": {
        errorCode: "ER_EXCESS_INVALID",
        errorMessage: "Invalid excess"
    },
	"missingCarRentalExcess": {
        errorCode: "ER_CAR_EXCESS_MISSING",
        errorMessage: "Car rental excess field missing"
    },
	"invalidCarRentalExcess": {
        errorCode: "ER_CAR_EXCESS_INVALID",
        errorMessage: "Invalid car rental excess"
    },
	"invalidOverseasMedical": {
        errorCode: "ER_OVERSEAS_MEDICAL_INVALID",
        errorMessage: "Invalid overseas medical"
    },
	"invalidAdditionalExpenses": {
        errorCode: "ER_ADDITIONAL_EXPENSES_INVALID",
        errorMessage: "Invalid additional expenses"
    },
    "missingAllowsMedicalAssessment": {
        errorCode: "ER_MEDICAL_CONDITION_MISSING",
        errorMessage: "Medical condition field missing"
    },
	"invalidAllowsMedicalAssessment": {
        errorCode: "ER_MEDICAL_CONDITION_INVALID",
        errorMessage: "Invalid medical condition"
    },
    "AllowsMedicalAssessmentIsFalseWithDomestic": {
        errorCode: "ER_MEDICAL_CONDITION_INVALID",
        errorMessage: "Invalid medical condition"
    },
    "AllowsMedicalAssessmentIsFalseWithInternational": {
        errorCode: "ER_MEDICAL_CONDITION_INVALID",
        errorMessage: "Invalid medical condition"
    },
    "AllowsMedicalAssessmentIsFalseWithAnnualCover": {
        errorCode: "ER_MEDICAL_CONDITION_INVALID",
        errorMessage: "Invalid medical condition"
    }
};

// Function to generate test cases
function generateTestCases() {
    // Add test cases for each error scenario
    Object.keys(errorScenarios).forEach(scenario => {
        addTestCase(scenario, getDefaultRequestData(scenario), 400, errorScenarios[scenario]);
    });
    // Add successful test cases
    addTestCase("Verify that a valid Single Trip Domestic with 1 traveller", getDefaultRequestData("Verify that a valid Single Trip Domestic with 1 traveller"), 200);
    addTestCase("Verify that a valid Single Trip Domestic with 2 travellers", getDefaultRequestData("Verify that a valid Single Trip Domestic with 2 travellers"), 200);
    addTestCase("Verify that a valid Single Trip Domestic with Family travellers", getDefaultRequestData("Verify that a valid Single Trip Domestic with Family travellers"), 200);
    addTestCase("Verify that a valid Single Trip International with 1 traveller", getDefaultRequestData("Verify that a valid Single Trip International with 1 traveller"), 200);
    addTestCase("Verify that a valid Single Trip International with 2 travellers", getDefaultRequestData("Verify that a valid Single Trip International with 2 travellers"), 200);
    addTestCase("Verify that a valid Single Trip International with Family travellers", getDefaultRequestData("Verify that a valid Single Trip International with Family travellers"), 200);
    addTestCase("Verify that a valid Single Trip International with multi destination", getDefaultRequestData("Verify that a valid Single Trip International with multi destination"), 200);
    addTestCase("Verify that a valid Annual Cover trip with 1 traveller", getDefaultRequestData("Verify that a valid Annual Cover trip with 1 traveller"), 200);
    addTestCase("Verify that a valid Annual Cover trip with 2 travellers", getDefaultRequestData("Verify that a valid Annual Cover trip with 2 travellers"), 200);
    addTestCase("Verify that a valid Annual Cover trip with Family travellers", getDefaultRequestData("Verify that a valid Annual Cover trip with Family travellers"), 200);
}

// Function to get default request data
function getDefaultRequestData(scenario) {
    let requestData = {
        "quoteTransactionId": "Q-CTM-TRAVEL-14",
        "policyType": "SINGLE",
        "travellerAges": [37, 37],
        "travellerChildAges": [2, 4, 6, 8, 10, 15],
        "contactDetails": {
            "firstName": "Dennis",
            "lastName": "Reynolds",
            "email": "dennis@paddys.com"
        },
        "singleTripDetails": {
            "fromDate": moment().add(5, 'days').format('YYYY-MM-DD'),
            "toDate": moment().add(15, 'days').format('YYYY-MM-DD')
        },
        "annualCoverDetails": {
            "startDate": moment().add(15, 'days').format('YYYY-MM-DD'),
            "maxTripDuration": 30
        },
        "destinations": ["GBR"],
        "extraCover": {
            "cruising": false,
            "snowSports": false
        },
        "coverLevels": {
            "tripCancellation": "NO_COVER",
            "luggage": "NO_COVER",
            "carRentalExcess": "NO_COVER",
            "excess": "TWO_HUNDRED",
            "overseasMedical": "NO_COVER",
            "additionalExpenses": "NO_COVER"
        },
        "allowsMedicalAssessment": false
    };

    // Modify request data based on scenario
    switch (scenario) {
        case "missingquoteTransactionId":
            delete requestData.quoteTransactionId;
            break;
        case "invalidPolicyType":
            requestData.policyType = "MULTI";
            break;
        case "missingPolicyType":
            delete requestData.policyType;
            break;
        case "invalidtravellerAges": 
            requestData.travellerAges  = [-24, 25]; // Negative age
            break;
        case "invalidtravellerAges greater than 110": 
            requestData.travellerAges  = [111]; // Negative age
            break;
        case "invalidtravellerAges less than 18": 
            requestData.travellerAges  = [17]; // Negative age
            break;
        case "missingTravellerAges":
            delete requestData.travellerAges;
            break;
        case "emptyTravellerAges":
            requestData.travellerAges = [];
            break;
        case "exceedingMaxTravellers":
            requestData.travellerAges = [30, 35, 40]; // More than 2 travellers
            break;
        case "NotAnArrayTravellerAge":
            requestData.travellerAges = 30; // Traveller Ages are not an array
            break;
        case "invalidChildAge":
            requestData.travellerChildAges = [5, -3]; // Negative child age
            break;
        case "invalidChildAge greater than equal 25":
            requestData.travellerChildAges = [5, 25]; // Child age is greater than equal 25
            break;
        case "exceedingMaxDependents":
            requestData.travellerChildAges = [5, 6, 7, 8, 9, 10, 11]; // More than 6 child ages
            break;   
        case "NotAnArrayTravellerChildAge":
            requestData.travellerChildAges = 5, 6, 7; // Traveller Child Ages are not an array
            break;
        case "invalidEmailFormat":
            requestData.contactDetails.email = "invalidemail.com"; // Invalid email format
            break;
        case "missingSingleTripDetails":
            delete requestData.singleTripDetails;
            break;
        case "invalidFormatStartDate":
            requestData.singleTripDetails.fromDate = moment().add(20, 'days').format('YYYY-DD-MM'); // Invalid date format
            break;
        case "invalidFormatEndDate":
            requestData.singleTripDetails.toDate = moment().add(20, 'days').format('YYYY-DD-MM'); // Invalid date format
            break;
        case "The end date is smaller than the start date":
            requestData.singleTripDetails.fromDate = moment().add(10, 'days').format('YYYY-MM-DD'); // The start date is today + 10 days
            requestData.singleTripDetails.toDate = moment().format('YYYY-MM-DD'); // The end date is today
            break;
        case "The start date is the past days":
            requestData.singleTripDetails.fromDate = moment().subtract(10, 'days').format('YYYY-MM-DD'); // The start date is today - 10 days
            requestData.singleTripDetails.toDate = moment().add(10, 'days').format('YYYY-MM-DD'); // The end date is today + 10 days
            break;
        case "The start date is greater than equal 365 days from today":
            let tempStartDate = moment().add(365, 'days').format('YYYY-MM-DD');
            let tempEndDate = moment(tempStartDate).add(10, 'days').format('YYYY-MM-DD');
            requestData.singleTripDetails.fromDate = tempStartDate; // The start date is today + 365 days
            requestData.singleTripDetails.toDate = tempEndDate; // The end date is the start date + 10 days
            break;
        /*case "The end date is greater than equal 365 days from the start date":
            let tempStartDate2 = moment().add(364, 'days').format('YYYY-MM-DD');
            let tempEndDate2 = moment(tempStartDate2).add(365, 'days').format('YYYY-MM-DD');
            requestData.singleTripDetails.fromDate = tempStartDate2; // The start date is today + 365 days
            requestData.singleTripDetails.toDate = tempEndDate2; // The end date is he start date + 365 days
            break;*/
        case "missingAnnualCoverDetails":
            requestData.policyType = "ANNUAL_COVER";
            requestData.destinations = ["WWD"];
            delete requestData.annualCoverDetails;
            break;
        case "invalidMaxTripDuration":
            requestData.policyType = "ANNUAL_COVER";
            requestData.destinations = ["WWD"];
            requestData.annualCoverDetails.maxTripDuration = [60]; // Invalid maxTripDuration. Accepted values are 15, 30, and 45 days
            break;
        case "unknownDestination":
            requestData.destinations = ["XYZ"]; // Unknown destination
            break;
        case "destination both Domestic and International":
            requestData.destinations = ["AUS", "FRA"]; // destination both Domestic and International
            break;
        case "unsafeDestination":
            requestData.destinations = ["AFG"]; // unsafe destination
            break;
        case "noProductDestination":
            requestData.destinations = ["SJM"]; // noProduct destination
            break;
        case "missingExtraCover":
        delete requestData.extraCover;
        break;
        case "invalidExtraCover":
            requestData.extraCover.cruising = "invalid"; // Invalid extra cover
            break;
        case "missingCruisingField":
            delete requestData.extraCover.cruising;
            break;
        case "missingSnowSportsField":
            delete requestData.extraCover.snowSports;
            break;
        case "missingCoverLevels":
            delete requestData.coverLevels;
            break;
        case "missingTripCancellation":
            delete requestData.coverLevels.tripCancellation;
            break;
        case "invalidTripCancellation":
            requestData.coverLevels.tripCancellation = "invalid"; // Invalid Trip Cancellation
            break;
        case "missingLuggage":
            delete requestData.coverLevels.luggage;
            break;
        case "invalidLuggage":
            requestData.coverLevels.luggage = "invalid"; // Invalid luggage
            break;
        case "missingExcess":
            delete requestData.coverLevels.excess;
            break;
        case "invalidExcess":
            requestData.coverLevels.excess = "invalid"; // Invalid excess
            break;
        case "missingCarRentalExcess":
            delete requestData.coverLevels.carRentalExcess;
            break;
        case "invalidCarRentalExcess":
            requestData.coverLevels.carRentalExcess = "invalid"; // Invalid Car Rental Excess
            break;	
        case "invalidOverseasMedical":
            requestData.coverLevels.overseasMedical = "invalid"; // Invalid Overseas Medical
            break;
        case "invalidAdditionalExpenses":
            requestData.destinations = ["AUS"]; // Mandatory for domestic trip
            requestData.coverLevels.additionalExpenses = "invalid"; // Invalid Additional Expenses
            break;
        case "missingAllowsMedicalAssessment":
            delete requestData.allowsMedicalAssessment;
            break;
        case "invalidAllowsMedicalAssessment":
            requestData.allowsMedicalAssessment = "invalid";
            break;
        case "AllowsMedicalAssessmentIsFalseWithDomestic":
            requestData.destinations = ["AUS"];
            requestData.allowsMedicalAssessment = "false";
            break;
        case "AllowsMedicalAssessmentIsFalseWithInternational":
            requestData.allowsMedicalAssessment = "false";
            break;
        case "AllowsMedicalAssessmentIsFalseWithAnnualCover":
            requestData.policyType = "ANNUAL_COVER";
            delete requestData.singleTripDetails;
            requestData.destinations = ["WW"];
            requestData.allowsMedicalAssessment = "false";
            break;
        case "Verify that a valid Single Trip Domestic with 1 traveller":
            requestData.destinations = ["AUS"];
            requestData.travellerAges = [40];
            requestData.travellerChildAges = [];
            break;
        case "Verify that a valid Single Trip Domestic with 2 travellers":
            requestData.destinations = ["AUS"];
            requestData.travellerAges = [40, 35];
            requestData.travellerChildAges = [];
            break;
        case "Verify that a valid Single Trip Domestic with Family travellers":
            requestData.destinations = ["AUS"];
            requestData.travellerAges = [40, 35];
            requestData.travellerChildAges = [5, 10, 15];
            break;
        case "Verify that a valid Single Trip International with 1 traveller":
            requestData.destinations = ["USA"];
            requestData.travellerAges = [40];
            requestData.travellerChildAges = [];
            break;
        case "Verify that a valid Single Trip International with 2 travellers":
            requestData.destinations = ["AUS"];
            requestData.travellerAges = [40, 35];
            requestData.travellerChildAges = [];
            break;
        case "Verify that a valid Single Trip International with Family travellers":
            requestData.destinations = ["AUS"];
            requestData.travellerAges = [40, 35];
            requestData.travellerChildAges = [5, 10, 15];
            break;
        case "Verify that a valid Single Trip International with multi destination":
            requestData.destinations = ["USA", "FRA"]; // multi destinations for International trip
            break;
        case "Verify that a valid Annual Cover trip with 1 traveller":
            requestData.policyType = "ANNUAL_COVER";
            delete requestData.singleTripDetails;
            requestData.destinations = ["WW"];
            requestData.travellerAges = [40];
            break;
        case "Verify that a valid Annual Cover trip with 2 travellers":
            requestData.policyType = "ANNUAL_COVER";
            delete requestData.singleTripDetails;
            requestData.destinations = ["WW"];
            requestData.travellerAges = [40, 35];
            break;
        case "Verify that a valid Annual Cover trip with Family travellers":
            requestData.policyType = "ANNUAL_COVER";
            delete requestData.singleTripDetails;
            requestData.destinations = ["WW"];
            requestData.travellerAges = [40, 35];
            requestData.travellerChildAges = [5, 10, 15];
            break;
        default:
            break;
    }
    return requestData;
}

// Generate test cases
generateTestCases();

describe('API Success Scenarios', function() {
    this.timeout(30000);
    const successTestCases = testCases.filter(testCase => testCase.expectedStatusCode === 200);
    successTestCases.forEach(testCase => {
        it(`${testCase.description} - Expected Status: ${testCase.expectedStatusCode}`, async function() {
            const startTime = Date.now();
            const response = await axios.post(
                config.apiEndpoint,
                testCase.request,
                { headers: { 'Content-Type': 'application/json',
                                 'x-api-key': config.apiKey // add x-api-key
                    } }
            );
            const responseTime = Date.now() - startTime;
            expect(response.status).to.equal(200);
            expect(responseTime).to.be.lessThan(ACCEPTABLE_RESPONSE_TIME);
            addContext(this, { title: 'Request Data', value: testCase.request });
            addContext(this, { title: 'Response Data', value: response.data });
            addContext(this, { title: 'Response Time', value: `${responseTime} ms` });
            // Log request and response data
            console.log("Request Data:", JSON.stringify(testCase.request, null, 2));
            console.log("Response Data:", JSON.stringify(response.data, null, 2));
            console.log(`Response Time: ${responseTime} ms`);
        });
    });
});

describe('API Error Scenarios', function() {
    this.timeout(30000);
    const errorTestCases = testCases.filter(testCase => testCase.expectedStatusCode === 400);
    errorTestCases.forEach(testCase => {
        it(`${testCase.description} - ${testCase.expectedErrorMessage.errorCode} - ${testCase.expectedErrorMessage.errorMessage}`, async function() {
            try {
                const response = await axios.post(
                    config.apiEndpoint,
                    testCase.request,
                    { headers: { 'Content-Type': 'application/json',
                                 'x-api-key': config.apiKey // add x-api-key
                    } }
                );
                // This should not be called since we expect an error response
                throw new Error("Expected error response, but got success response.");
            } catch (error) {
                if (error.response) {
                    const response = error.response;
                    expect(response.status).to.equal(400);
                    const responseBody = response.data.error[0];
                    expect(responseBody.code).to.equal(testCase.expectedErrorMessage.errorCode);
                    expect(responseBody.message).to.equal(testCase.expectedErrorMessage.errorMessage);
                    addContext(this, { title: 'Request Data', value: testCase.request });
                    addContext(this, { title: 'Response Data', value: response.data });
                    // Log request and response data
                    console.log("Request Data:", JSON.stringify(testCase.request, null, 2));
                    console.log("Response Data:", JSON.stringify(response.data, null, 2));
                } else {
                    throw new Error(`Expected an error response but got: ${error.message}`);
                }
            }
        });
    });
});
