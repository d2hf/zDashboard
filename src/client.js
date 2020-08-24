import AWS from 'aws-sdk';

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
    for (i=0; i<4; i++){
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

    for (i=0; i<dateLoopLength; i++) {
        var date = dateArray[i];
        jsonVega['data']['values'].push({Data: date, Valor: "0"});
    }
    vegaEmbed('#salesVis', jsonVega);
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

    for (i=0; i<dateLoopLength; i++) {
        var date = dateArray[i];
        jsonVega['data']['values'].push({Data: date, Faturado: "0"});
    }
    vegaEmbed('#billedVis', jsonVega);
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

    for (i=0; i<dateLoopLength; i++) {
        var date = dateArray[i];
        jsonVega['data']['values'].push({Data: date, Peso: "0"});
    }
    vegaEmbed('#weightVis', jsonVega);
}

function generateSalesPlot(data, dateArray) {
    // basic plot configuration
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Valor';

    // search configuration
    var innerLoopLength = data['Responses']['zdashboard'].length
    var dateLoopLength = dateArray.length;

    for (i=0; i<dateLoopLength; i++){
        // configuration for search
        var found = 0;
        var date = dateArray[i];

        for (j=0; j<innerLoopLength; j++){
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

    vegaEmbed('#salesVis', jsonVega);
}

function generateBilledPlot(data, dateArray) {
    // basic plot configuration
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Faturado';

    // search configuration
    var innerLoopLength = data['Responses']['zdashboard'].length
    var dateLoopLength = dateArray.length;

    for (i=0; i<dateLoopLength; i++){
        // configuration for search
        var found = 0;
        var date = dateArray[i];

        for (j=0; j<innerLoopLength; j++){
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

    vegaEmbed('#billedVis', jsonVega);
}

function generateWeightPlot(data, dateArray) {
    // basic plot configuration
    var jsonVega = getJsonVega();
    jsonVega['encoding']['x']['field'] = 'Data';
    jsonVega['encoding']['y']['field'] = 'Peso';

    // search configuration
    var innerLoopLength = data['Responses']['zdashboard'].length
    var dateLoopLength = dateArray.length;

    for (i=0; i<dateLoopLength; i++){
        // configuration for search
        var found = 0;
        var date = dateArray[i];

        for (j=0; j<innerLoopLength; j++){
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

    vegaEmbed('#weightVis', jsonVega);
}

function getItens() {
    // configures DB query
    var dateArray = getLast5Days();
    var params = generateParams(dateArray);

    var creds = new CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:716e44bc-2e9a-4ff9-afd9-a6ecdfb2d21a',
    });

    AWS.config.credentials = creds;
    AWS.config.update({region: "us-east-1"});

    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

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
generateEmptySalesPlot();
generateEmptyBilledPlot();
generateEmptyWeightPlot();
getItens();