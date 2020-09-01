import AWS from 'aws-sdk';
import embed from 'vega-embed';
import Auth from "@aws-amplify/auth";
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

async function signOut() {
    try {
        await Auth.signOut();
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
            // gets date info
            timestamp = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;

            // pushes to array
            dateArray.push( timestamp );
        }
        // gets next date
        d.setDate(d.getDate() + 1);
    }
    return (dateArray);
}

/*

DYNAMO DB PARAMS

 */

function generateParams() {
    let dates = getDaysOfMonth();
    let loopLength = dates.length;
    var params = getJsonBase();

    for (var i=0; i<loopLength; i++) {
        params['RequestItems']['zdashboard']['Keys'].push({'idRelatorio': {'S': dates[i]}});
    }
    return (params);
}


function getJsonBase() {
    var params = {
        RequestItems: {
            "zdashboard": {
                Keys: []
            }
        }};
    return( params );
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

function generateBilledPlot(data) {
    let ctx = document.getElementById('billedChart').getContext('2d');
    let barData = getBilledPlotData(data);
    var newBarChart = new Chart(ctx, barData);
}

function generateWeightPlot(data) {
    let ctx = document.getElementById('weightChart').getContext('2d');
    let barData = getWeigthPlotData(data);
    var newBarChart = new Chart(ctx, barData);
}

function generateSalesPlot(data) {
    var ctx = document.getElementById('salesChart').getContext('2d');
    let barData = getSalesPlotData(data);
    var newBarChart = new Chart(ctx, barData);
}

function getBilledPlotData(data){
    let returnArray = [];
    let labelText = "Total faturado";
    let barData = getEmptyBarData(labelText, 6000);

    let days = getDaysOfMonth();
    let lengthDays = days.length;

    // search configuration
    let innerLoopLength = data['Responses']['zdashboard'].length;

     for (var i=0; i<lengthDays; i++){
        // configuration for search
        let found = 0;
        let date = days[i];

        for (let j=0; j<innerLoopLength; j++){
            // if values has already been found skip loop
            if (found == 1) { break;}

            // gets is from DB response for comparsion
            var itemId = data['Responses']['zdashboard'][j]['idRelatorio']['S'];

            // if match is found add visualization JSON
            if (itemId == date) {
                let billed = data['Responses']['zdashboard'][j]['totalBilled']['S'];
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
    let labelText = "Peso faturado";
    let barData = getEmptyBarData(labelText, 0);

    let days = getDaysOfMonth();
    let lengthDays = days.length;

    // search configuration
    let innerLoopLength = data['Responses']['zdashboard'].length;

     for (var i=0; i<lengthDays; i++){
        // configuration for search
        let found = 0;
        let date = days[i];

        for (let j=0; j<innerLoopLength; j++){
            // if values has already been found skip loop
            if (found == 1) { break;}

            // gets is from DB response for comparsion
            var itemId = data['Responses']['zdashboard'][j]['idRelatorio']['S'];

            // if match is found add visualization JSON
            if (itemId == date) {
                let weight = data['Responses']['zdashboard'][j]['weightBilled']['S'];
                returnArray.push(weight);

                found = 1;
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
    let labelText = "Vendas mensal";
    let barData = getEmptyBarData(labelText, 7500);

    let days = getDaysOfMonth();
    let lengthDays = days.length;

    // search configuration
    let innerLoopLength = data['Responses']['zdashboard'].length;

     for (var i=0; i<lengthDays; i++){
        // configuration for search
        let found = 0;
        let date = days[i];

        for (let j=0; j<innerLoopLength; j++){
            // if values has already been found skip loop
            if (found == 1) { break;}

            // gets is from DB response for comparsion
            var itemId = data['Responses']['zdashboard'][j]['idRelatorio']['S'];

            // if match is found add visualization JSON
            if (itemId == date) {
                let sold = data['Responses']['zdashboard'][j]['totalSold']['S'];
                returnArray.push(sold);

                found = 1;
            }
        }
        if (found == 0)
            returnArray.push(0);
    }
    barData['data']['datasets'][0]['data'] = returnArray;

    return ( barData );
}
/*

DB REQUEST

 */

async function getItens() {
    // configures DB query
    var params = generateParams();

    AWS.config.update({region: "us-east-1"});

    try {
        const user = await Auth.currentCredentials();
        var credentials = new AWS.Credentials({
            accessKeyId: user.accessKeyId,
            secretAccessKey: user.secretAccessKey,
            sessionToken: user.sessionToken
        });
    } catch (err) {
        console.error('Unable to retrieve credentials.');
        console.error(err);
    }

    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', credentials});

    dynamodb.batchGetItem(params, function(err, data) {
        /*
        if error - break process
        else - generatePlots using the batchedData
         */
        if (err) {
            console.log("Error", err);
        } else {
            console.log(data);
            generateSalesPlot(data);
            generateBilledPlot(data);
            generateWeightPlot(data);
        }
    });
}

document.getElementById('btnSignOut').addEventListener('click', signOut);

//generateEmptySalesPlot();
//generateEmptyBilledPlot();
//generateEmptyWeightPlot();
getItens();