import Auth from "@aws-amplify/auth";
import API from "@aws-amplify/api";
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

async function signOut() {
    try {
        await Auth.signOut();
        redirectLogin();
    } catch (error) {
    console.error('Error signing out.');
    console.error(error);
    }
}

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
/*

CHART.JS

 */

function getEmptyBarData(labelText, goalLine) {
    let data ={
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: labelText,
                data: [],
                backgroundColor: 'rgba(214, 236, 251, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    }

    let days = getDaysOfMonth();
    let arrayLength = days.length;
    let zerosDays = new Array(arrayLength).fill(0);

    data['data']['labels'] = days;
    data['data']['datasets'][0]['data'] = zerosDays;

    if (goalLine != 0){

        let emptyLineDataset = {
            label: 'Objetivo diário',
            data: [],
            type: 'line'               
        }


        data['data']['datasets'].push(emptyLineDataset);

    let goalLineArray = new Array(arrayLength).fill(goalLine);
    data['data']['datasets'][1]['data'] = goalLineArray;
    } 

    return ( data );
}

function generateBilledPlot(daily_sales) {
    let ctx = document.getElementById('billedChart').getContext('2d');
    let barData = getBilledPlotData(daily_sales);
    var newBarChart = new Chart(ctx, barData);
}

function generateSalesPlot(daily_sales) {
    var ctx = document.getElementById('salesChart').getContext('2d');
    let barData = getSalesPlotData(daily_sales);
    var newBarChart = new Chart(ctx, barData);
}

function generateWeightPlot(daily_sales) {
    let ctx = document.getElementById('weightChart').getContext('2d');
    let barData = getWeigthPlotData(daily_sales);
    var newBarChart = new Chart(ctx, barData);
}

function getBilledPlotData(data){
    let returnArray = [];
    let labelText = "Total faturado";
    let barData = getEmptyBarData(labelText, 6000);

    let days = getDaysOfMonth();
    let lengthDays = days.length;

    // search configuration
    let innerLoopLength = data.length;

     for (let i=0; i<lengthDays; i++){
        // configuration for search
        let found = 0;
        let date = days[i];

        for (let j=0; j<innerLoopLength; j++){
            // gets is from DB response for comparsion
            let createdAt = data[j]['createdAt'];

            // if match is found add visualization JSON
            if (createdAt == date) {
                let billed = data[j]['totalBilled'];
                returnArray.push(billed);

                found = 1;
                break;
            }
        }
        if (found == 0)
            returnArray.push(0);
    }
    barData['data']['datasets'][0]['data'] = returnArray;

    return ( barData );
}

function getSalesPlotData(data){
    let returnArray = [];
    let labelText = "Venda Mensal";
    let barData = getEmptyBarData(labelText, 6000);

    let days = getDaysOfMonth();
    let lengthDays = days.length;

    // search configuration
    let innerLoopLength = data.length;

    for (var i=0; i<lengthDays; i++){
        // configuration for search
        let found = 0;
        let date = days[i];

        for (let j=0; j<innerLoopLength; j++){
            // if values has already been found skip loop
            if (found == 1) { break;}

            // gets is from DB response for comparsion
            var createdAt = data[j]['createdAt'];

            // if match is found add visualization JSON
            if (createdAt == date) {
                let billed = data[j]['totalSold'];
                returnArray.push(billed);

                found = 1;
            }
        }
        if (found == 0)
            returnArray.push(0);
    }
    barData['data']['datasets'][0]['data'] = returnArray;

    return ( barData );
}

function getWeigthPlotData(data){
    let returnArray = [];
    let labelText = "Peso Faturado";
    let barData = getEmptyBarData(labelText, 500);

    let days = getDaysOfMonth();
    let lengthDays = days.length;

    // search configuration
    let innerLoopLength = data.length;

    for (var i=0; i<lengthDays; i++){
        // configuration for search
        let found = 0;
        let date = days[i];

        for (let j=0; j<innerLoopLength; j++){
            // if values has already been found skip loop
            if (found == 1) { break;}

            // gets is from DB response for comparsion
            var createdAt = data[j]['createdAt'];

            // if match is found add visualization JSON
            if (createdAt == date) {
                let billed = data[j]['weightBilled'];
                returnArray.push(billed);

                found = 1;
            }
        }
        if (found == 0)
            returnArray.push(0);
    }
    barData['data']['datasets'][0]['data'] = returnArray;

    return ( barData );
}
/* *********************************************************************************** */
/* *********************************************************************************** */
/* *********************************************************************************** */
/* *********************************************************************************** */


function redirectLogin (){
   document.location = 'login.html';
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
            generateBilledPlot(response.data.dailyReports);
            generateSalesPlot(response.data.dailyReports);
            generateWeightPlot(response.data.dailyReports);

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
