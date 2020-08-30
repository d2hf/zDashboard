import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';

Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_qxqYDrRYz',
    userPoolWebClientId: '2ghd3u701ls9mc66ht68g4p7cn',
    identityPoolId: 'us-east-1:716e44bc-2e9a-4ff9-afd9-a6ecdfb2d21a',
});

function processForm() {
    // retrieves data from forms
    var totalSold = document.getElementById("salesTotal").value;
    var totalBilled = document.getElementById("billedTotal").value;
    var weightBilled = document.getElementById("weightBilled").value;
    var inputJuliana = document.getElementById("inputJuliana").value;
    var inputAnderson = document.getElementById("inputAnderson").value;
    var inputBoaIdeia = document.getElementById("inputBoaIdeia").value;
    var inputFerronato = document.getElementById("inputFerronato").value;
    var inputMaxel = document.getElementById("inputMaxel").value;
    var inputSagrima = document.getElementById("inputSagrima").value;


    // adds data to dynamoDB
    putInDataBase(totalSold, totalBilled, weightBilled, inputJuliana, inputBianfer, inputAnderson,
        inputBoaIdeia, inputFerronato, inputMaxel, inputSagrima);
}

async function putInDataBase(totalSold, totalBilled, weightBilled, inputJuliana, inputBianfer,
                             inputAnderson, inputBoaIdeia, inputFerronato, inputMaxel, inputSagrima) {
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

    const date = new Date();
    const timestamp = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

    var params = {
        Item: {
            "idRelatorio": {
                S: timestamp
            },
            "totalSold": {
                S: totalSold.toString()
            },
            "totalBilled": {
                S: totalBilled.toString()
            },
            "weightBilled": {
                S: weightBilled.toString()
            },
            "createdAt": {
                S: timestamp
            },
            "inputJuliana": {
                S: inputJuliana.toString()
            },
            "inputBianfer": {
                S: inputBianfer.toString()
            },
            "inputAnderson": {
                S: inputAnderson.toString()
            },
            "inputBoaIdeia": {
                S: inputBoaIdeia.toString()
            },
            "inputFerronato": {
                S: inputFerronato.toString()
            },
            "inputMaxel": {
                S: inputMaxel.toString()
            },
            "inputSagrima": {
                S: inputMaxel.toString()
            },
        },
        ReturnConsumedCapacity: "TOTAL",
        TableName: "zdashboard"
    };

    dynamodb.putItem(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

document.getElementById("btnSubmit").addEventListener("click", processForm);