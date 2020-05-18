import { FunctionalComponent as FC, h } from 'preact';
import * as style from './style.css';

const Home: FC = () => {
    return (
        <div class={style.home}>
            <div class={style.phoneSection}>
                <div class={`${style.phoneContainer}`}>
                    <img
                        class={style.phone}
                        src="../../assets/Mockup_iphone.png"
                    />
                    <div disabled class={style.downloadBage}>
                        <img src="../../assets/appstore.svg" />
                    </div>
                </div>
                <div class={style.phoneContainer}>
                    <img
                        class={style.phone}
                        src="../../assets/Mockup_android.png"
                    />
                    <div disabled class={style.downloadBage}>
                        <img src="../../assets/google-play-badge.png" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
