import puppeteer from 'puppeteer';

// https://github.com/DevExpress/testcafe/blob/master/src/browser/provider/built-in/locally-installed.js
// import browserTools from 'testcafe-browser-tools';


const openedPages = {};

let timeoutId;

const reloadPages = () => {
    console.log("sts::reloading pages", openedPages);
    let allPages = Object.values(openedPages)
        .map(page => page.reload());
    return Promise.all(allPages)
        .then(() => console.log("sts::reloaded"));
}

const startReloadPagesTimer = (timeout) => {
    stopReloadPagesTimer(timeoutId);
    timeoutId = setTimeout(() => {
        reloadPages();
    }, timeout);
    console.log("sts::startReloadPagesTimer, id=" + timeoutId + " time=" + timeout);
    return timeoutId;
}

const stopReloadPagesTimer = () => {
    console.log("sts::stopReloadPagesTimer, id=" + timeoutId);
    clearTimeout(timeoutId)
}

function extractRegexp(s, regexp) {
    let arr = regexp.exec(s) || [null, null];
    return arr[1];
}

function getWidthHeight(browserArgs) {
    const widthHeight = browserArgs.find(item => item.startsWith("width"));
    const width = extractRegexp(widthHeight, /width=(\d*);/g);
    const height = extractRegexp(widthHeight, /height=(\d*)/g);
    return {width, height};
}

// https://github.com/puppeteer/puppeteer/issues/1834
// https://bugs.chromium.org/p/chromium/issues/detail?id=1085829
// https://github.com/puppeteer/puppeteer

export default {
    reloadPages: reloadPages,
    startReloadPagesTimer: startReloadPagesTimer,
    stopReloadPagesTimer: stopReloadPagesTimer,

    isMultiBrowser: true, // Multiple browsers support

    browser: null,

    async openBrowser(id, pageUrl, browserName) {
        console.log("puppeteersts::openBrowser");
        const browserArgs = browserName.split(':');
        if (!this.browser) {
            let {width, height} = getWidthHeight(browserArgs);
            width = width || 1280;
            width = parseInt(width);
            height = height || 720;
            height = parseInt(height);
            console.log(`puppeteersts:: width=${width} height=${height}`);
            const launchArgs = {
                timeout: 60000,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    `--window-size=${width},${height}`
                ],
                headless: browserArgs.includes("headless"),
                defaultViewport: {width, height}
            };
            console.log("puppeteersts::opening browser, launchArgs: ", launchArgs);
            this.browser = await puppeteer.launch(launchArgs);
            console.log("puppeteersts::browser opened");
        }
        console.log("puppeteersts::opening page");
        const page = await this.browser.newPage();
        console.log("puppeteersts::page opened");

        console.log("puppeteersts::opening url=" + pageUrl);
        await page.goto(pageUrl);
        openedPages[id] = page;
        console.log("puppeteersts::url opened");
    },

    async closeBrowser(id) {
        console.log("puppeteersts::closing browser");
        stopReloadPagesTimer();
        delete openedPages[id];
        await this.browser.close();
        this.browser = null;
        console.log("puppeteersts::browser closed");
    },

    async isValidBrowserName() {
        console.log("puppeteersts::isValidBrowserName");
        return true;
    },

    async resizeWindow(id, width, height) {
        console.log("puppeteersts::resizeWindow ", arguments);
        await openedPages[id].setViewport({width, height});
    },

    async takeScreenshot(id, screenshotPath) {
        console.log("puppeteersts::takeScreenshot ", arguments);
        await openedPages[id].screenshot({path: screenshotPath});
    }
};




