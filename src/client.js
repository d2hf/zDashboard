import Auth from "@aws-amplify/auth";
import API from "@aws-amplify/api";
import {signOut} from './user-activity/logout.js'
import {getBarPlotData, generatePlot} from  './plot/data.js'
import Chart from 'chart.js';

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

function getDaysOfMonth () {
    // set output data for function
    let dateArray = [];
    let timestamp;

    // set date params for loop
    let actualDate = new Date();
    let month = actualDate.getMonth();
    let year = actualDate.getFullYear();

    // gets first day of current month
    let d = new Date(year, month, 1);

    // iterates over dates
    // if weekday push to vector
    while (d.getMonth() === month){
        // if weekday
        if (d.getDay() != 6 && d.getDay() != 0){

            // pushes to array
            dateArray.push( formatDate(d) );
        }
        // gets next date
        d.setDate(d.getDate() + 1);
    }
    return (dateArray);
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

async function createReport(yearMonth) {
    const apiName = "ReportsApi";
    const path = "";
    const myInit = { // OPTIONAL
        headers: {}, // OPTIONAL
        response: true,
        queryStringParameters: {
            date: "2020-9",
        },
    };

    await API.get(apiName, path, myInit)
        .then(response => {

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

function getYear(){
    let date = new Date;
    return date.getFullYear();
}

function getMonth(){
    let date = new Date;
    return date.getMonth() + 1;
}

document.getElementById('btnSignOut').addEventListener('click', signOut);

let month = getMonth();
let year = getYear();

createReport("oi");
