import Auth from "@aws-amplify/auth";

Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_qxqYDrRYz',
    userPoolWebClientId: '2ghd3u701ls9mc66ht68g4p7cn',
    identityPoolId: 'us-east-1:716e44bc-2e9a-4ff9-afd9-a6ecdfb2d21a',
});

function signUpButtonHandler() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signUpUser(email, password);
}

async function signUpUser(email, password) {
    try {
        const { user } = await Auth.signUp({
            username: email,
            password,
            attributes: {
                email
            }
        });
        console.log('Sign up successful.');
        console.log(user);
    } catch (error) {
        console.error('Error signing up.');
        console.error(error);
    }
}

document.getElementById("btnSignUp").addEventListener("click", signUpButtonHandler);