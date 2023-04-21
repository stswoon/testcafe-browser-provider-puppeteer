import Page from './page-model';
import * as sts from "testcafe-browser-provider-puppeteer"

fixture`e2e tests 1`
    .page`http://ya.ru/`
;

const page = new Page();

test('it should render header element1', async t => {
    await t
        .expect(page.Header.exists).ok();
});

test('it should render header element2', async t => {
    await t
        .expect(page.Header.exists).ok();
});

test('it should render header element3', async t => {
    sts.default.reloadPages();
    await t
        .wait(5000)
        .expect(page.Header.exists).ok();
});

test('it should render header element4', async t => {
    sts.default.startReloadPagesTimer(1000);
    await t
        .wait(3000)
        .expect(page.Header.exists).ok();
    sts.default.stopReloadPagesTimer();
});

test('it should render header element5', async t => {
    let timerId = sts.default.startReloadPagesTimer(1000);
    sts.default.stopReloadPagesTimer();
    await t
        .wait(3000)
        .expect(page.Header.exists).ok();
});

