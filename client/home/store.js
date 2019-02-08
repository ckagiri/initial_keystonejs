import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import appReducers from 'app/reducers';
// import memberReducers from 'member/reducers';
// import otherMemberReducers from 'otherMember/reducers';
// import gameReducers from 'game/reducers';
// import competitionReducers from 'competition/reducers';
// import homeReducers from 'home/reducers';
// import staticReducers from 'static/reducers';
// import entitiesReducers from 'entities/reducers';
// import commonReducers from 'common/reducers';
// import leaderboardReducers from 'leaderboard/reducers';
// import newsReducers from 'news/reducers';
// import streamReducers from 'live/reducers';

const reducers = combineReducers({
    app: appReducers,
    // member: memberReducers,
    // otherMember: otherMemberReducers,
    // game: gameReducers,
    // competition: competitionReducers,
    // home: homeReducers,
    // static: staticReducers,
    // form: formReducer,
    // entities: entitiesReducers,
    // common: commonReducers,
    // leaderboard: leaderboardReducers,
    // news: newsReducers,
    // stream: streamReducers
});

// Create the store
const store = createStore(
    reducers,
    compose(
        applyMiddleware(
            // Support thunked actions and react-router-redux
            thunk
        ),
        // Support the Chrome DevTools extension
        window.devToolsExtension && process.env.NODE_ENV !== 'production'
            ? window.devToolsExtension()
            : f => f
    )
);

store.subscribe(() => {});

export default store;
