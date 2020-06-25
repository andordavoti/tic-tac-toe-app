import { FunctionalComponent, h } from 'preact';
import * as style from './style.css';
import Container from '../../components/container';

const Privacy: FunctionalComponent = () => {
    return (
        <Container>
            <div class={style.privacy}>
                We only collect anonymous user data (IP address, software and
                hardware info) when the app crashes to make the user experience
                better.
            </div>
        </Container>
    );
};

export default Privacy;
