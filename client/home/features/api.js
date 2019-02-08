import xhr from 'xhr';

export const api = {};

export const initApi = function initApi() {
    return new Promise((resolve, reject) => {
        xhr(
            {
                // uri: API_ENTRY_POINT,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            (err, res, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                body = JSON.parse(body);
                api.urls = body;
                resolve(api);
            }
        );
    });
};

export default api;
