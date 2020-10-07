import Auth from '@aws-amplify/auth';
import {redirectLogin, redirectIndex} from "./user-activity/redirections";

Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_qxqYDrRYz',
    userPoolWebClientId: '2ghd3u701ls9mc66ht68g4p7cn',
});

function loginButtonHandler() {
    const username = document.getElementById("username").value;
    const old_password = document.getElementById("old-password").value;
    const new_password1 = document.getElementById("new-password1").value;
    const new_password2 = document.getElementById("new-password1").value;

    if (new_password1 === new_password2)
        authenticateChangePassword(username, old_password, new_password1);
    else
        console.log('login failed, input correct password');
}

async function authenticateChangePassword(username, oldPassword, newPassword) {
    try {
        const user = await Auth.signIn(username, oldPassword);

        if (user.challengeName === 'NEW_PASSWORD_REQUIRED')
            Auth.completeNewPassword(
                user,               // the Cognito User Object
                newPassword,       // the new password
            ).then(user => {
                redirectIndex();
            }).catch(e => {
                console.log(e);
            });
        else
            redirectLogin();

    } catch (error) {
        console.error('Error signing in.');
        console.error(error);
    }
}

document.getElementById("btnLogin").addEventListener("click", loginButtonHandler);
