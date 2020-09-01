module.exports = {
    entry: {
        index: "./src/index.js",
        client: "./src/client.js",
        login: "./src/login.js",
        signup: "./src/signup.js",
        confirmSignup: "./src/confirmSignup.js",
        logged: "./src/logged.js",
        loggedLoginFile: "./src/loggedLoginFile.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    }
};