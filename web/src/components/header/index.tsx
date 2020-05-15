import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import * as style from './style.css';

const Header: FunctionalComponent<PropTypes> = ({ title }) => {
    return (
        <header class={style.header}>
            <h1>{title}</h1>
            <nav>
                <Link activeClassName={style.active} href="/">
                    Home
                </Link>
                <Link activeClassName={style.active} href="/privacy">
                    Privacy
                </Link>
            </nav>
        </header>
    );
};

interface PropTypes {
    title: string;
}

export default Header;
