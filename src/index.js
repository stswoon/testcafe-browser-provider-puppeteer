import puppeteer from 'puppeteer';

export default {
    // Multiple browsers support
    isMultiBrowser: true,

    browser: null,

    openedPages: {},

    // Required - must be implemented
    // Browser control
    async openBrowser(id, pageUrl, browserName, retry) {
        const browserArgs = browserName.split(':');
        if (!this.browser) {
            const launchArgs = {
                timeout: 10000
            };

            const noSandboxArgs = ['--no-sandbox', '--disable-setuid-sandbox'];

            if (browserArgs.indexOf('no_sandbox') !== -1) launchArgs.args = noSandboxArgs;
            else if (browserName.indexOf('?') !== -1) {
                const userArgs = browserName.split('?');
                const params = userArgs[0];

                if (params === 'no_sandbox') launchArgs.args = noSandboxArgs;

                const executablePath = userArgs[1];

                if (executablePath.length > 0)
                    launchArgs.executablePath = executablePath;
            }
            console.log("sts::open browser")
            this.browser = await puppeteer.launch(launchArgs);
            console.log("sts::browser opened")
        }

        console.log("sts::open page")
        const page = await this.browser.newPage();
        console.log("sts::page opened")

        const emulationArg = browserArgs.find(v => /^emulate/.test(v));

        if (Boolean(emulationArg)) {
            const [, emulationDevice] = emulationArg.split('=');
            const device = puppeteer.devices[emulationDevice];

            if (!device) throw new Error('Emulation device is not supported');

            await page.emulate(device);
        }

        console.log("sts::goto url=" + pageUrl);
        return new Promise((resolve, reject) => {
            const gotoTimeout = setTimeout(() => {
                console.error("sts::gotoTimeout");

                if (retry) {
                    console.error("sts::retry already used");
                    reject("sts::gotoTimeout");
                } else {
                    console.log("sts::retry");
                    this.closeBrowser(id)
                        .then(() => this.openBrowser(id, pageUrl, browserName, true))
                        .then(() => resolve());
                }

            }, 30 * 1000);
            page.goto(pageUrl)
                .then(() => {
                    console.log("sts::url opened");
                    clearTimeout(gotoTimeout);
                    this.openedPages[id] = page;
                    resolve();
                })
                .catch((e) => {
                    console.error("sts::error", e)
                    clearTimeout(gotoTimeout);
                    reject(e);
                })
        });
    },

    async closeBrowser(id) {
        delete this.openedPages[id];
        await this.browser.close();
    },

    async isValidBrowserName() {
        return true;
    },

    // Extra methods
    async resizeWindow(id, width, height) {
        await this.openedPages[id].setViewport({width, height});
    },

    async takeScreenshot(id, screenshotPath) {
        await this.openedPages[id].screenshot({path: screenshotPath});
    }
};
