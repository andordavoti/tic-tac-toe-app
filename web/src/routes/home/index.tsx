import { FunctionalComponent as FC, h } from 'preact';
import * as style from './style.css';
import Container from '../../components/container';

const Home: FC = () => {
    return (
        <div>
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
            <Container>
                <div style={style.description}>
                    Cross-platform mobile (iOS and android) online multiplayer
                    game, built using React Native, Redux, Expo, Firestore and
                    Firebase Cloud functions. Play Tic Tac Toe cross-platform.
                    Both online and in-person with your friends. We don't
                    require you to create an account. Instead, we utilize
                    anonymous lobby id's. Therefore only you and the one you're
                    playing with online know who is playing with who.
                </div>
            </Container>
        </div>
    );
};

export default Home;
