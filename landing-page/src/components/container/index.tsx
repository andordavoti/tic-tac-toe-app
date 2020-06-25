import { FunctionalComponent, h } from 'preact';
import * as style from './style.css';

const Container: FunctionalComponent = ({ children }) => {
    return <div class={style.container}>{children}</div>;
};

export default Container;
