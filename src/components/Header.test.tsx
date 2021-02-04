import { render } from '@testing-library/react';
import React from 'react';
import Header from './Header';
describe("Header", () => {
    it ('matches snapshot', () => {
        const { container } = render(<Header >inside</Header>);
        expect(container).toMatchSnapshot();
    })

})