const puppeteer = require("puppeteer");
let { email, password } = require("./secrets");
let cTab;

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

        let loggedInPromise = cTab.click(
            'button[data-analytics = "LoginPassword"]'
        );
        return loggedInPromise;
    })
    .then(function () {
        console.log("logged into hackerrank successfully");

        // waitAndClick will wait for enitre web page to load then will search the       selector and then will click on the node
        let openAlgoTabPromise = waitAndClick(
            'div[data-automation="algorithms"]'
        );
        return openAlgoTabPromise;
    })
    .then(function () {
        console.log("Algorithms page opened");
    })
    .catch(function (err) {
        console.log(err);
    });

function waitAndClick(selector) {
    let myPromise = new Promise(function (resolve, reject) {
        let waitForSelectorPromise = cTab.waitForSelector(selector);

        waitForSelectorPromise
            .then(function () {
                let clickPromise = cTab.click(selector);
                return clickPromise;
            })
            .then(function () {
                resolve();
            })
            .catch(function (err) {
                console.log(err);
            });
    });
}
