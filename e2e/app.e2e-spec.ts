import { BiiSoftTemplatePage } from './app.po';

describe('BiiSoft App', function() {
  let page: BiiSoftTemplatePage;

  beforeEach(() => {
    page = new BiiSoftTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
