import Chart from "chart.js";

export function generateQuartilePlot(data, xKey, yDescription, elementId, xLabels){
    let ctx = document.getElementById(elementId).getContext('2d');
    let lineData = getQuartilePlotData(data, xKey, xLabels, yDescription);
    console.log(lineData);
    var newBarChart = new Chart(ctx, lineData);
}

export function getQuartilePlotData(data, xKey, xLabels, labelText){
    let quart1 = [];
    let quart2 = [];
    let quart3 = [];
    let quart4 = [];

    let barData = getEmptyQuartileData(labelText, xLabels);

    let lengthLabels = xLabels.length;

    // search configuration
    let innerLoopLength = data.length;

    for (let i=0; i<lengthLabels; i++){
        // configuration for search
        let found = 0;
        let label = xLabels[i];

        for (let j=0; j<innerLoopLength; j++){
            // gets is from DB response for comparsion
            let tempLabel = data[j][xKey];

            // if match is found add visualization JSON
            if (tempLabel == label) {
                let quartile_1 = data[j]['quartile1'];
                let quartile_2 = data[j]['quartile2'];
                let quartile_3 = data[j]['quartile3'];
                let quartile_4 = data[j]['quartile4'];

                quart1.push(quartile_1);
                quart2.push(quartile_2);
                quart3.push(quartile_3);
                quart4.push(quartile_4);
                found = 1;

                break;
            }
        }
        if (found == 0){
            quart1.push(0);
            quart2.push(0);
            quart3.push(0);
            quart4.push(0);
        }
    }
    barData['data']['datasets'][0]['data'] = quart1;
    barData['data']['datasets'][1]['data'] = quart2;
    barData['data']['datasets'][2]['data'] = quart3;
    barData['data']['datasets'][3]['data'] = quart4;

    return ( barData );
}


function getEmptyQuartileData(labelText, labelArray) {
    let data = {
        type: 'line',
        data: [],
        options: {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    }

    let days = labelArray;
    let arrayLength = days.length;
    let arr = Array(arrayLength).fill(0);
    let arr1 = Array(arrayLength).fill(10);


    data['data']['labels'] = days;
    data['data']['datasets'] = [];
    data['data']['datasets'].push({'data': arr});
    data['data']['datasets'].push({'data': arr1});
    data['data']['datasets'].push({'data': arr});
    data['data']['datasets'].push({'data': arr1});


    return ( data );
}