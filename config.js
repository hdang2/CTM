// config.js
const config = {
    dev: {
        apiEndpoint: 'https://test.mobile-api.woolworths.com.au/insurance/aggregator/svc/api/ctm/travel/quote'
    },
    uat: {
        apiEndpoint: 'https://uat.mobile-api.woolworths.com.au/insurance/aggregator/svc/api/ctm/travel/quote'
    },
    prod: {
        apiEndpoint: 'https://prod.mobile-api.woolworths.com.au/insurance/aggregator/svc/api/ctm/travel/quote'
    }
};

module.exports = config[process.env.NODE_ENV || 'dev'];
