const puppeteer = require("puppeteer");
let { email, password } = require("./secrets");
let cTab;

// let email = "xikibid862@robhung.com";
// let password = "pepcoding123";

let browserOpen = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximised"],
});

browserOpen
    .then(function (browser) {
        console.log("Browser is opened");

        let allTabsPromise = browser.pages();
        return allTabsPromise;
    })
    .then(function (allTabs) {
        cTab = allTabs[0];
        console.log("new tab");
        let VisitLoginPage = cTab.goto("http://www.hackerrank.com/auth/login/");
        return VisitLoginPage;
    })
    .then(function () {
        console.log("hackerrank opened");
        let emailTypePromise = cTab.type('input[name="username"]', email);
        return emailTypePromise;
    })
    .then(function () {
        console.log("email is typed");
        let passwordTypePromise = cTab.type('input[name="password"]', password);
        return passwordTypePromise;
    })
    .then(function () {
        console.log("Password is Typed");
        //button[data-analytics = "LoginPassword"]
        let loggedInPromise = cTab.click(
            'button[data-analytics = "LoginPassword"]'
        );
        return loggedInPromise;
    })
    .then(function () {
        console.log("logged into hackerrank successfully");
    })
    .catch(function (err) {
        console.log("Error");
    });
