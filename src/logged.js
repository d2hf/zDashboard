import Auth from '@aws-amplify/auth';
import {redirectLogin} from "./user-activity/redirections";

Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_qxqYDrRYz',
    userPoolWebClientId: '2ghd3u701ls9mc66ht68g4p7cn',
});

async function isLogged(){
    try {
        await Auth.currentAuthenticatedUser();
        return (true)
    }   catch(e) {
        return (false)
    }
}

isLogged().then(function (value) {
    if (!value)
        redirectLogin();
});