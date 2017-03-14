import { SPAWithAngular2Page } from './app.po';

describe('spawith-angular2 App', () => {
  let page: SPAWithAngular2Page;

  beforeEach(() => {
    page = new SPAWithAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
