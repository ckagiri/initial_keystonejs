import { combineReducers } from 'redux';

import appState from 'app/reducers/appState';
import responsive from 'app/reducers/responsive';

export default combineReducers({
    appState,
    responsive,
});
