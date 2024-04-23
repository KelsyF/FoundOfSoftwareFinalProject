



describe('6 | Searches', () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
      });
    
      afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
      });

    it('6.1 | Search string in question text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('navigation{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('6.2 | Search string matches tag and text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('navigation [React]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('6.3 | Output of the search should be in newest order by default', () => {
        const qTitles = ['Quick question about storage on android','android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
    });

    it('6.4 | Output of the search should show number of results found', () => {
        const qTitles = ['Quick question about storage on android',"Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.contains(qTitles.length+" questions");
    });

    it('6.5 | Output of the empty search should show all results ', () => {
        const qTitles = ['Quick question about storage on android','Object storage for a web application',"Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('{enter}');
        cy.contains(qTitles.length+" questions");
    });

    it('6.6 | Search string with non-existing tag and non-tag word', () => {
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[NonExistingTag] nonexistingword{enter}');
        cy.contains('No Questions Found');
    });

    it('6.7 | Search string with case-insensitive matching', () => {
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('AnDrOiD{enter}');
        cy.contains('android');
    });
});