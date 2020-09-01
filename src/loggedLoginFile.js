import Auth from '@aws-amplify/auth';

Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_qxqYDrRYz',
    userPoolWebClientId: '2ghd3u701ls9mc66ht68g4p7cn',
});

async function loginIsLogged(){
    try {
        await Auth.currentAuthenticatedUser();
        return (true)
    }   catch(e) {
        return (false)
    }
}

loginIsLogged().then(function (value) {
    if (value)
        redirectIndex();
});

function redirectIndex (){
   document.location = 'index.html';
}