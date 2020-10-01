import Chart from "chart.js";

export function generatePlot(data, xKey, yKey, yDescription, yTarget, elementId, xLabels){
    let ctx = document.getElementById(elementId).getContext('2d');
    let barData = getBarPlotData(data, xKey, yKey,
        xLabels, yDescription, yTarget);
    var newBarChart = new Chart(ctx, barData);
}

export function getBarPlotData(data, xKey, yKey, xLabels, labelText, yTarget){
    let returnArray = [];
    let barData = getEmptyBarData(labelText, xLabels, yTarget);

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
                let finalData = data[j][yKey];
                returnArray.push(finalData);

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


function getEmptyBarData(labelText, labelArray, goalLine) {
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

    let days = labelArray;
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