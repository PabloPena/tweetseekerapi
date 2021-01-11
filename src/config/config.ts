/**
 *  Application variables setup
 */
const config = {
    // Twitter api config
    twitterApi: {
        endpoint: "https://api.twitter.com",
        version: "2",
        accessToken: 'AAAAAAAAAAAAAAAAAAAAAE0cLgEAAAAAvU4inZW%2FK2fYgazXlILhwbf6GI0%3Dw8VmlnvXaSbhC8cxIgteUceqABdLh2x6R4wntcxGqs3CUW9nCt',
        numAttempts: 3,
        maxResultsByRequest: 15,
        streamTimeout: 31000 // In miliseconds
    },
};

export default config;
