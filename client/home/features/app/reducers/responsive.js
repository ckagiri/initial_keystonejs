export const GET_SCREEN_WIDTH_AND_HEIGHT_SUCCESS = 'APP/RESPONSIVE';

export const getScreenWidthAndHeightSuccess = data => ({ type: GET_SCREEN_WIDTH_AND_HEIGHT_SUCCESS, data });

export const getScreenWidthAndHeight = () => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const mobile_mql = window.matchMedia("(min-width: 0px) and (max-width: 767px)").matches;
        const tablet_mql = window.matchMedia("(min-width: 768px) and (max-width: 1229px)").matches;
        const desktop_mql = window.matchMedia("(min-width: 1230px)").matches;
        let type = null;
        if(!!mobile_mql){
            type = 'mobile';
        }
        if(!!tablet_mql){
            type = 'tablet';
        }
        if(!!desktop_mql){
            type = 'desktop';
        }
        const data = {
            width: window.innerWidth,  
            height: window.innerHeight,
            type: type
        };

        dispatch(getScreenWidthAndHeightSuccess(data));
        resolve(data);
    })  
    .catch(err => {
        throw new Error(err);
        return Promise.reject();
    });
};

const initialState={

}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_SCREEN_WIDTH_AND_HEIGHT_SUCCESS: {
            return Object.assign({}, state, {
                height: action.data.height,
                width: action.data.width,
                type: action.data.type
            });
        }
        default: {
            return state;
        }
    }
};
