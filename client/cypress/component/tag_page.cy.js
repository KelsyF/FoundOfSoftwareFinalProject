import Tag from "../../src/components/main/tagPage/tag";
import TagPage from "../../src/components/main/tagPage";
import {UserProvider} from "../../src/components/context/UserContext";


describe('Tag', () => {

    it('Renders tag component', () => {
        const tag = { name: "(=ಠᆽಠ=)", qcnt: 3 };
        const clickTagSpy = cy.spy().as('clickTagSpy');
        const onDeleteSpy = cy.spy().as('onDeleteSpy');

        cy.mount(
            <UserProvider>
                <Tag
                    t={tag}
                    clickTag={clickTagSpy}
                    onDelete={onDeleteSpy}
                />
            </UserProvider>)
        cy.get('.tagNode .tagName').contains(tag.name);
        cy.get('.tagNode .tagQcnt').contains(tag.qcnt);
        cy.get('.tagNode').click();
        cy.get('@clickTagSpy').should('have.been.called');
    });

})