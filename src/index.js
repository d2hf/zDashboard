import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import API from "@aws-amplify/api";

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
});

async function signOut() {
    try {
        await Auth.signOut();
        redirectLogin();
    } catch (error) {
    console.error('Error signing out.');
    console.error(error);
    }
}

function processForm() {
    const formData = getReportFormData();
    console.log(formData);
    //const timestamp = getTimestamp();

    createReport(formData)
        .then(() => {
            console.log("Yay");
        })
        .catch((e) => {
            console.error("Boo");
            console.log(e);
        });
}

const getDate = () => {
    let date = document.getElementById("date").value;
    let timestamp = date.split("-").join("-");
    return timestamp;
}

const getReportFormData = () => {
    let date = getDate();
    return {
        createdAt: date,
        totalBilled: parseFloat(document.getElementById("billedTotal").value),
        totalSold: parseFloat(document.getElementById("salesTotal").value),
        weightBilled: parseFloat(document.getElementById("weightBilled").value),
        inputAnderson: parseFloat(document.getElementById("inputAnderson").value),
        inputEmpresa: parseFloat(document.getElementById("inputEmpresa").value),
        inputBoaIdeia: parseFloat(document.getElementById("inputBoaIdeia").value),
        inputFerronato: parseFloat(document.getElementById("inputFerronato").value),
        inputJuliana: parseFloat(document.getElementById("inputJuliana").value),
        inputMaxel: parseFloat(document.getElementById("inputMaxel").value),
        inputSagrima: parseFloat(document.getElementById("inputSagrima").value),
    };
};

async function createReport(data) {
    const apiName = "ReportsApi";
    const path = "";
    const options = {
        body: {
            ...data
        }
    }

    await API.post(apiName, path, options)
        .then(response => console.log(response))
        .catch(error => console.log(error));
}

function redirectLogin (){
   document.location = 'login.html';
}

document.getElementById('btnSignOut').addEventListener('click', signOut);
document.getElementById("btnSubmit").addEventListener("click", processForm);