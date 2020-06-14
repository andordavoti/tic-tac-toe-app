import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Home from './routes/home';
import Privacy from './routes/Privacy';
import NotFoundPage from './routes/notfound';
import Header from './components/header';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require('preact/debug');
}

const App: FunctionalComponent = () => {
    return (
        <div id="app">
            <Header title="Tic Tac Toe" />
            <Router>
                <Route path="/" component={Home} />
                <Route path="/privacy/" component={Privacy} />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
