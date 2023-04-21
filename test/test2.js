import Page from './page-model';
import * as sts from "testcafe-browser-provider-puppeteer"

fixture`e2e tests 2`
    .page`http://ya.ru/`
;

const page = new Page();

test('it should render header element6', async t => {
    await t
        .expect(page.Header.exists).ok();
});
