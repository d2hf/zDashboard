import Auth from "@aws-amplify/auth";
import API from "@aws-amplify/api";
import {signOut} from './user-activity/logout.js';
import {generatePlot} from  './plot/data.js';
import {getDaysOfMonth, getYearMonth} from "./date-handler/dates-extracts";
import {allOverlaysOff} from "./stylers/edit-style";

/*

GENERAL CONFIGURATION

 */

Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_qxqYDrRYz',
    userPoolWebClientId: '2ghd3u701ls9mc66ht68g4p7cn',
    identityPoolId: 'us-east-1:716e44bc-2e9a-4ff9-afd9-a6ecdfb2d21a',
});

API.configure({
    endpoints: [
        {
            name: "ReportsApi",
            endpoint: "https://wcqz3goash.execute-api.us-east-1.amazonaws.com/dev",
            custom_header: async () => {
                return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`}
            }
        }
    ]
})

async function createReport(yearMonth) {
    const apiName = "ReportsApi";
    const path = "";
    const myInit = { // OPTIONAL
        headers: {}, // OPTIONAL
        response: true,
        queryStringParameters: {
            date: yearMonth,
        },
    };

    await API.get(apiName, path, myInit)
        .then(response => {
            allOverlaysOff("my-overlay");
            let days = getDaysOfMonth();
            generatePlot(response.data.dailyReports,
                        "createdAt",
                        "totalBilled",
                        "Total Faturado",
                        5000,
                        'billedChart',
                        days);

            generatePlot(response.data.dailyReports,
                "createdAt",
                "totalBilled",
                "Total Faturado",
                5000,
                'salesChart',
                days);

            generatePlot(response.data.dailyReports,
                "createdAt",
                "weightBilled",
                "Peso Faturado",
                500,
                'weightChart',
                days);

        })
        .catch(error => console.log(error));
}

document.getElementById('btnSignOut').addEventListener('click', signOut);


createReport(getYearMonth());
