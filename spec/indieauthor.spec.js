const domloader = require('./domloader');

describe('INDIeAuthor setup', () => {
    it('should load indieauthor plugin into DOM', function (done) {
        domloader().then(window => {
            expect(window.indieauthor).toBeDefined;
        }).then(() => done()).catch((err) => console.log(err));
    })
})