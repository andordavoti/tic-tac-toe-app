import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import * as style from './style.css';

const Privacy: FunctionalComponent = () => {
    return (
        <div class={style.privacy}>
            We only collect anonymous user data (IP adress, software and
            hardware info) when the app crashes to make the user experience
            better.
        </div>
    );
};

export default Privacy;
