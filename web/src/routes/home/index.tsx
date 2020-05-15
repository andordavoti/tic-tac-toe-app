import { FunctionalComponent as FC, h } from 'preact';
import * as style from './style.css';

const Home: FC = () => {
    return (
        <div class={style.home}>
            <div class={style.phoneContainer}>
                <img src="../../assets/Mockup_iphone.png" />
                <h5>DOWNLOAD IN IOS</h5>
            </div>
            <div class={style.phoneContainer}>
                <img src="../../assets/Mockup_iphone.png" />
                <h5>DOWNLOAD ON PLAY STORE</h5>
            </div>
        </div>
    );
};

export default Home;
