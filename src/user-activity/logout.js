import Auth from "@aws-amplify/auth";
import {redirectLogin} from './redirections.js'

export async function signOut() {
    try {
        await Auth.signOut();
        redirectLogin();
    } catch (error) {
        console.error('Error signing out.');
        console.error(error);
    }
}