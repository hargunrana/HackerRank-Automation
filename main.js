const { log } = require("console");
const puppeteer = require("puppeteer");
let { email, password } = require("./secrets");
let { answers } = require("./codes");
let cTab;

let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-fullscreen"],
});

browserOpenPromise
    .then(function (browser) {
        console.log("Browser is opened");

        let allTabsPromise = browser.pages();
        return allTabsPromise;
    })
    .then(function (allTabs) {
        cTab = allTabs[0];
        console.log("New Tab is created");
        let VisitLoginPage = cTab.goto("http://www.hackerrank.com/auth/login/");
        return VisitLoginPage;
    })
    .then(function () {
        console.log("Hackerrank opened");
        let emailTypePromise = cTab.type('input[name="username"]', email, {
            delay: 100,
        });
        return emailTypePromise;
    })
    .then(function () {
        console.log("Email is typed");
        let passwordTypePromise = cTab.type(
            'input[name="password"]',
            password,
            { delay: 100 }
        );
        return passwordTypePromise;
    })
    .then(function () {
        console.log("Password is Typed");

        let loggedInPromise = cTab.click(
            'button[data-analytics = "LoginPassword"]',
            { delay: 100 }
        );
        return loggedInPromise;
    })
    .then(function () {
        console.log("Logged into Hackerrank Successfully");

        // waitAndClick will wait for enitre web page to load then will search the       selector and then will click on the node
        let openAlgoTabPromise = waitAndClick(
            'div[data-automation="algorithms"]',
            { delay: 100 }
        );
        return openAlgoTabPromise;
    })
    .then(function () {
        console.log("Algorithm page is opened");
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
        console.log("Links to all questions received");
        //console.log(allLinks);

        // Solving the question
        let quesWillBeSolvedPromise = questionSolver(allLinks[1], 1);
        return quesWillBeSolvedPromise;
    })
    .then(function () {
        console.log("Question is Solved");
        console.log("CONGRATS CODE IS PERFECT");
    })
    .catch(function (err) {
        console.log(err);
    });

// -------------------------> Defined Functions <-------------------------

// Function to wait and search for the selector then click
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

// Function to solve the question
function questionSolver(url, idx) {
    return new Promise(function (resolve, reject) {
        let fullLink = `http://www.hackerrank.com${url}`;

        let goToQuesPagePromise = cTab.goto(fullLink);

        goToQuesPagePromise
            .then(function () {
                console.log("Question Opened");
                // Tick the custom input box mark
                let waitForSettingsPromise = cTab.waitForSelector(
                    ".hr-monaco-settings-editor"
                );
                return waitForSettingsPromise;
            })
            .then(function () {
                // Select the editor
                console.log("Disabled Autocomplete");
                let cursorOnEditorPromise = cTab.click(
                    ".hr-monaco-editor-parent"
                );
                return cursorOnEditorPromise;
            })
            .then(function () {
                console.log("Clicked on Text field");
                let ArrowDownPromise = cTab.keyboard.down("ArrowDown");
                for (let i = 1; i < 50; i++) {
                    ArrowDownPromise = cTab.keyboard.down("ArrowDown");
                }
                return ArrowDownPromise;
            })
            .then(function () {
                console.log("Moved cursor down");
                let deleteTextPromise = cTab.keyboard.press("Backspace");
                for (let i = 1; i < 1000; i++) {
                    deleteTextPromise = cTab.keyboard.press("Backspace", {
                        delay: 100,
                    });
                }
                return deleteTextPromise;
            })
            .then(function () {
                let clickOnSettingsEditorPromise = cTab.click(
                    ".hr-monaco-settings-editor",
                    { delay: 100 }
                );
                return clickOnSettingsEditorPromise;
            })
            .then(function () {
                console.log("Settings Opened");
                let disableAutoCompletePromise = cTab.click(
                    `button[aria-label="Disable Autocomplete"]`,
                    { delay: 200 }
                );
                return disableAutoCompletePromise;
            })
            .then(function () {
                let clickOnSettingsEditorPromise = cTab.click(
                    ".hr-monaco-settings-editor",
                    { delay: 100 }
                );
                return clickOnSettingsEditorPromise;
            })
            .then(function () {
                // Select the editor
                console.log("Disabled Autocomplete");
                let cursorOnEditorPromise = cTab.click(
                    ".hr-monaco-editor-parent"
                );
                return cursorOnEditorPromise;
            })
            .then(function () {
                console.log("Deleted");
                let typingPromise = cTab.type(
                    ".hr-monaco-editor-parent",
                    answers[0],
                    { delay: 50 }
                );
                return typingPromise;
            })
            .then(function () {
                console.log("Clicked on Text Field");
                let ArrowDownPromise = cTab.keyboard.down("ArrowDown");
                for (let i = 1; i < 3; i++) {
                    ArrowDownPromise = cTab.keyboard.down("ArrowDown");
                }
                return ArrowDownPromise;
            })
            .then(function () {
                console.log("Moved Cursor down");
                let deleteTextPromise = cTab.keyboard.press("Backspace");
                for (let i = 1; i < 3; i++) {
                    deleteTextPromise = cTab.keyboard.press("Backspace");
                }
                return deleteTextPromise;
            })
            .then(function () {
                console.log("Final Code Typed");
                let clickOnSubmitButtonPromise = cTab.click(
                    ".hr-monaco-submit",
                    { delay: 100 }
                );
                return clickOnSubmitButtonPromise;
            })
            .then(function () {
                console.log("Code submitted sucessfully");
                resolve();
            })
            .catch(function (err) {
                console.log(err);
            });
    });
}
