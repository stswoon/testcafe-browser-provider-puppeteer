import Page from './page-model';

fixture`e2e tests`
    .page`http://ya.ru/`
;

const page = new Page();

test('it should render header element', async t => {
    await t
        .expect(page.Header.exists).ok();
});

test('it should render header element2', async t => {
    await t
        .expect(page.Header.exists).ok();
});
