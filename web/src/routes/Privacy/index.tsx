import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import * as style from './style.css';

const Privacy: FunctionalComponent = () => {
    return <div class={style.privacy}>This is privacy</div>;
};

export default Privacy;
