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
    const timestamp = getTimestamp();

    createReport(formData, timestamp)
        .then(() => {
            console.log("Yay");
        })
        .catch(() => {
            console.error("Boo");
        });
}

const getReportFormData = () => {
    return {
        totalSold: document.getElementById("salesTotal").value,
        totalBilled: document.getElementById("billedTotal").value,
        weightBilled: document.getElementById("weightBilled").value,
        inputJuliana: document.getElementById("inputJuliana").value,
        inputAnderson: document.getElementById("inputAnderson").value,
        inputBoaIdeia: document.getElementById("inputBoaIdeia").value,
        inputFerronato: document.getElementById("inputFerronato").value,
        inputMaxel: document.getElementById("inputMaxel").value,
        inputSagrima: document.getElementById("inputSagrima").value
    };
};

const getTimestamp = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

async function createReport(data, createdAt) {
    const apiName = "ReportsApi";
    const path = "";
    const options = {
        body: {
            createdAt,
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