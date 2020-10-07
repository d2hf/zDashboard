module.exports = {
    entry: {
        index: "./src/index.js",
        client: "./src/client.js",
        login: "./src/login.js",
        logged: "./src/logged.js",
        loggedLoginFile: "./src/loggedLoginFile.js",
        signup: "./src/signup.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist/js"
    }
};