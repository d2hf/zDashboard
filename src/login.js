import Auth from '@aws-amplify/auth';
import {redirectIndex, redirectSignup} from "./user-activity/redirections";

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
        // authenticates at AWS
        const user = await Auth.signIn(username, password);

        // checks if is necessary to change password
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED')
            redirectSignup();
        else
            redirectIndex();
    } catch (error) {
        console.error('Error signing in.');
        console.error(error);

        // changes html for UX
        let alert = document.getElementById("alert");
        alert.style.display = "block";
    }
}

document.getElementById("btnLogin").addEventListener("click", loginButtonHandler);
