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
                    <div class={style.downloadBage}>
                        <a href="https://apps.apple.com/us/app/tic-tac-toe-online/id1513609441?ls=1">
                            <img src="../../assets/appstore.svg" />
                        </a>
                    </div>
                </div>
                <div class={style.phoneContainer}>
                    <img
                        class={style.phone}
                        src="../../assets/Mockup_android.png"
                    />
                    <div class={style.downloadBage}>
                        <a href="https://play.google.com/store/apps/details?id=com.andordavoti.tictactoe.game">
                            <img src="../../assets/google-play-badge.png" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
