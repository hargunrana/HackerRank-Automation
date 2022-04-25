const { log } = require("console");
const puppeteer = require("puppeteer");
let { email, password } = require("./secrets");
let cTab;

let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximised"],
});

browserOpenPromise
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
        console.log("Algo page is opened");
        // resolve();
        let allQuestionPromise = cTab.waitForSelector(
            'a[data-analytics="ChallengeListChallengeName"]'
        );
        return allQuestionPromise;
    })
    .then(function () {
        // .evaluate

        function getAllQuesLinks() {
            let allElemArr = document.querySelectorAll(
                'a[data-analytics="ChallengeListChallengeName"]'
            );
            let allLinks = [];
            for (let i = 0; i < allElemArr.length; i++) {
                allLinks.push(allElemArr[i].getAttribute("href"));
            }
            return allLinks;
        }
        let linksArrPromise = cTab.evaluate(getAllQuesLinks);
        return linksArrPromise;
    })
    .then(function (allLinks) {
        console.log("links to all questions received");
        console.log(allLinks);

        // Solving the question
        let quesWillBeSolvedPromise = questionSolver(allLinks[0], 0);
        return quesWillBeSolvedPromise;
    })
    .then(function () {
        console.log("question is solved");
    })
    .catch(function (err) {
        console.log(err);
    });

// -------------------------> Defined Functions <-------------------------

function waitAndClick(selector) {
    let waitClickPromise = new Promise(function (resolve, reject) {
        let waitForSelectorPromise = cTab.waitForSelector(selector);

        waitForSelectorPromise
            .then(function () {
                console.log("Algo button is found");
                let clickPromise = cTab.click(selector);
                return clickPromise;
            })
            .then(function () {
                console.log("Algo button is clicked");
                resolve();
            })
            .catch(function (err) {
                console.log(err);
            });
    });
    return waitClickPromise;
}

function questionSolver(url, idx) {
    return new Promise(function (resolve, reject) {
        let fullLink = `http://www.hackerrank.com${url}`;

        let goToQuesPagePromise = cTab.goto(fullLink);

        goToQuesPagePromise
            .then(function () {
                console.log("question opened");
                resolve();
            })
            .catch(function (err) {
                console.log(err);
            });
    });
}
