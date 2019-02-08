export const INIT_APP_SUCCESS = 'APP/INIT_APP';

export const initAppSuccess = label => ({ type: INIT_APP_SUCCESS });

export const initApp = () => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        // const access_token = getState().member.auth.access_token;
        // const memberId = getState().member.auth.memberId;
        // if (memberId !== '' && access_token !== '') {
        //     return dispatch(getMemberInfo(memberId, access_token));
        // } else {
            return Promise.resolve();
        // }
    })
        .then(() => {
            dispatch(initAppSuccess());
            return Promise.resolve();
        })
        .catch(err => {
            throw new Error(err);
        });
};

const initialState = {
    appInitialized: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case INIT_APP_SUCCESS: {
            return Object.assign({}, state, {
                appInitialized: true
            });
        }
        default: {
            return state;
        }
    }
};
