import Auth from '@aws-amplify/auth';
import {DynamoDB} from "aws-sdk";

Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_qxqYDrRYz',
    userPoolWebClientId: '2ghd3u701ls9mc66ht68g4p7cn',
});

function loginButtonHandler() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    authenticateUser(username, password);
}

async function authenticateUser(username, password) {
    try {
        const user = await Auth.signIn(username, password);
        console.log('Sign In successful.');
        console.log(user);
    } catch (error) {
        console.error('Error signing in.');
        console.error(error);
    }
}

document.getElementById("btnLogin").addEventListener("click", loginButtonHandler);
