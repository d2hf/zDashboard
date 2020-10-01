import Auth from "@aws-amplify/auth";

export async function signOut() {
    try {
        await Auth.signOut();
        redirectLogin();
    } catch (error) {
        console.error('Error signing out.');
        console.error(error);
    }
}


function redirectLogin () {
    document.location = 'login.html';
}
