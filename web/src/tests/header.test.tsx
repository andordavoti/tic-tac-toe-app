import { h } from 'preact';
// See: https://github.com/mzgoddard/preact-render-spy
import { shallow } from 'preact-render-spy';
import Header from '../components/header';

describe('Initial Test of the Header', () => {
    test('Header renders 3 nav items', () => {
        const context = shallow(<Header title="Tic Tac Toe" />);
        expect(context.find('h1').text()).toBe('Tic Tac Toe');
        expect(context.find('Link').length).toBe(2);
    });
});
