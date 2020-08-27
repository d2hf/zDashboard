import AWS from 'aws-sdk';
import embed from 'vega-embed';
import Auth from "@aws-amplify/auth";

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

function getLast5Days () {
    var result = [];
    for (var i=0; i<5; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        var timestamp = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
        result.push( timestamp )
    }

    return(result);
}

function generateParams (dateArray) {
    var arrayLastDays = getLast5Days();
    var params = getJsonBase();
    for (var i=0; i<4; i++) {
        params['RequestItems']['zdashboard']['Keys'][i]['idRelatorio']['S'] = dateArray[i];
    }
    return (params);
}

function getJsonBase() {
    var params = {
        RequestItems: {
            "zdashboard": {
                Keys: [
                    {
                        "idRelatorio":{"S":""}
                    },
                    {
                        "idRelatorio":{"S":""}
                    },
                    {
                        "idRelatorio":{"S":""}
                    },
                    {
                        "idRelatorio":{"S":""}
                    }
                ]
            }
        }};
    return( params );
}

function getJsonVega() {
    var vegaJson = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        width: 300,
        height: 200,
        data: {
            values: [
            ]
        },
        mark: 'bar',
        encoding: {
            x: {field: '', type: 'ordinal'},
            y: {field: '', type: 'quantitative'}
        }
    };
    return (vegaJson);
}

function generateEmptySalesPlot(){
    /*
    creates basic json for the creation
    of an empty sales chart
    */
    // gets date array
    var dateArray = getLast5Days();

    // gets loop configuration
    var dateLoopLength = dateArray.length;

    // gets Vega sales' json
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Valor';

    for (var i=0; i<dateLoopLength; i++) {
        var date = dateArray[i];
        jsonVega['data']['values'].push({Data: date, Valor: "0"});
    }
    embed('#salesVis', jsonVega);
}

function generateEmptyBilledPlot(){
    /*
    creates basic json for the creation
    of an empty billed chart
    */
    // gets date array
    var dateArray = getLast5Days();

    // gets loop configuration
    var dateLoopLength = dateArray.length;

    // gets Vega sales' json
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Faturado';

    for (var i=0; i<dateLoopLength; i++) {
        var date = dateArray[i];
        jsonVega['data']['values'].push({Data: date, Faturado: "0"});
    }
    embed('#billedVis', jsonVega);
}

function generateEmptyWeightPlot(){
    /*
    creates basic json for the creation
    of an empty weight chart
    */
    // gets date array
    var dateArray = getLast5Days();

    // gets loop configuration
    var dateLoopLength = dateArray.length;

    // gets Vega sales' json
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Peso';

    for (var i=0; i<dateLoopLength; i++) {
        var date = dateArray[i];
        jsonVega['data']['values'].push({Data: date, Peso: "0"});
    }
    embed('#weightVis', jsonVega);
}

function generateSalesPlot(data, dateArray) {
    // basic plot configuration
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Valor';

    // search configuration
    var innerLoopLength = data['Responses']['zdashboard'].length
    var dateLoopLength = dateArray.length;

    for (var i=0; i<dateLoopLength; i++){
        // configuration for search
        var found = 0;
        var date = dateArray[i];

        for (var j=0; j<innerLoopLength; j++){
            // if values has already been found skip loop
            if (found == 1) { break;}

            // gets is from DB response for comparsion
            var itemId = data['Responses']['zdashboard'][j]['idRelatorio']['S'];

            // if match is found add visualization JSON
            if (itemId == date) {
                var sales = data['Responses']['zdashboard'][j]['totalSold']['S'];
                jsonVega['data']['values'].push({Data:date, Valor: sales});

                found = 1;
            }
        }
        if (found == 0)
            jsonVega['data']['values'].push({Data:date, Valor: "0"});
    }

    embed('#salesVis', jsonVega);
}

function generateBilledPlot(data, dateArray) {
    // basic plot configuration
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Faturado';

    // search configuration
    var innerLoopLength = data['Responses']['zdashboard'].length
    var dateLoopLength = dateArray.length;

    for (var i=0; i<dateLoopLength; i++){
        // configuration for search
        var found = 0;
        var date = dateArray[i];

        for (var j=0; j<innerLoopLength; j++){
            // if values has already been found skip loop
            if (found == 1) { break;}

            // gets is from DB response for comparsion
            var itemId = data['Responses']['zdashboard'][j]['idRelatorio']['S'];

            // if match is found add visualization JSON
            if (itemId == date) {
                var billed = data['Responses']['zdashboard'][j]['totalBilled']['S'];
                jsonVega['data']['values'].push({Data:date, Faturado: billed});

                found = 1;
            }
        }
        if (found == 0)
            jsonVega['data']['values'].push({Data:date, Faturado: "0"});
    }

    embed('#billedVis', jsonVega);
}

function generateWeightPlot(data, dateArray) {
    // basic plot configuration
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Peso';

    // search configuration
    var innerLoopLength = data['Responses']['zdashboard'].length
    var dateLoopLength = dateArray.length;

    for (var i=0; i<dateLoopLength; i++){
        // configuration for search
        var found = 0;
        var date = dateArray[i];

        for (var j=0; j<innerLoopLength; j++){
            // if values has already been found skip loop
            if (found == 1) { break;}

            // gets is from DB response for comparsion
            var itemId = data['Responses']['zdashboard'][j]['idRelatorio']['S'];

            // if match is found add visualization JSON
            if (itemId == date) {
                var weight = data['Responses']['zdashboard'][j]['weightBilled']['S'];
                jsonVega['data']['values'].push({Data:date, Peso: weight});

                found = 1;
            }
        }
        if (found == 0)
            jsonVega['data']['values'].push({Data:date, Peso: "0"});
    }

    embed('#weightVis', jsonVega);
}

async function getItens() {
    // configures DB query
    var dateArray = getLast5Days();
    var params = generateParams(dateArray);

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
            generateSalesPlot(data, dateArray);
            generateBilledPlot(data, dateArray);
            generateWeightPlot(data, dateArray);
        }
    });
}

document.getElementById('btnSignOut').addEventListener('click', signOut);

generateEmptySalesPlot();
generateEmptyBilledPlot();
generateEmptyWeightPlot();
getItens();