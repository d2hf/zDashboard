import Auth from "@aws-amplify/auth";

Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_qxqYDrRYz',
    userPoolWebClientId: '2ghd3u701ls9mc66ht68g4p7cn',
    identityPoolId: 'us-east-1:716e44bc-2e9a-4ff9-afd9-a6ecdfb2d21a',
});

function confirmSignUpButtonHandler() {
    const email = document.getElementById("email").value;
    const code = document.getElementById("code").value;
    confirmSignUpUser(email, code);
}

async function confirmSignUpUser(email, code) {
    try {
        await Auth.confirmSignUp(email, code);
        console.log('Sign up confirmed');
    } catch (error) {
        console.error('Error confirming sign up');
        console.error(error);
    }
}

document.getElementById("btnConfirm").addEventListener("click", confirmSignUpButtonHandler);