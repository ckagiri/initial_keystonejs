const path = require('path');
const url = require('url');
const li = require('li');

class RequestHelper {
    constructor({ enableDebug = false, forceNoEncryption = false } = {}) {
        this.resGeneralData = {};
        this.responseGeneralDataCallback = null;
        this.enableDebug = enableDebug;
        this.forceNoEncryption = forceNoEncryption;
    }

    getUrlObject(req) {
        return {
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.path
        };
    }

    // GET
    sendGetRes(req, res, resData, status = 200) {
        res.status(status);
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Expose-Headers', 'ETag, Link');
        res.json(resData);
    }

    /**
	 * @paginationData: {
	 * 	total: all matching results (not just on this page)
		currentPage: the index of the current page
		totalPages: the total number of pages
		pages: array of pages to display
		previous: index of the previous page, false if at the first page
		next: index of the next page, false if at the last page
		first: the index of the first result included
		last: index of the last result included
		perPage: number of item per page
	 * }
	 */
    sendPaginationGetRes(req, res, resData, paginationData) {
        const linksObject = {};

        if (paginationData.totalPages > 1) {
            const urlObject = this.getUrlObject(req);
            if (paginationData.previous) {
                linksObject.first = url.format(
                    Object.assign({}, urlObject, {
                        query: Object.assign({}, req.query, {
                            page: paginationData.pages[0],
                            perPage: paginationData.perPage
                        })
                    })
                );

                linksObject.prev = url.format(
                    Object.assign({}, urlObject, {
                        query: Object.assign({}, req.query, {
                            page: paginationData.previous,
                            perPage: paginationData.perPage
                        })
                    })
                );
            }

            if (paginationData.next) {
                linksObject.next = url.format(
                    Object.assign({}, urlObject, {
                        query: Object.assign({}, req.query, {
                            page: paginationData.next,
                            perPage: paginationData.perPage
                        })
                    })
                );

                linksObject.last = url.format(
                    Object.assign({}, urlObject, {
                        query: Object.assign({}, req.query, {
                            page:
                                paginationData.pages[
                                    paginationData.totalPages - 1
                                ],
                            perPage: paginationData.perPage
                        })
                    })
                );
            }
        }

        if (Object.keys(linksObject).length > 1) {
            res.set('Link', li.stringify(linksObject));
        }

        res.set('X-Total-Count', paginationData.total || 0);
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Expose-Headers', 'ETag, Link, X-Total-Count');
        res.json(resData);
    }

    // POST

    sendPostRes(req, res, resData, status = 200) {
        res.status(status);
        res.set('Access-Control-Allow-Origin', '*');
        if (resData) {
            res.json(resData);
        } else {
            res.end();
        }
    }

    sendPostErrorRes(req, res, resData, status = 400) {
        this.sendPostRes(req, res, resData, status);
    }

    sendPostToCreateRes(req, res, id) {
        const locationHeaderObject = {
            protocol: req.protocol,
            host: req.get('host'),
            pathname: path.join(req.path, id)
        };

        res.set('Location', url.format(locationHeaderObject));
        res.set('Access-Control-Expose-Headers', 'Location');
        this.sendPostRes(req, res, '', 201);
    }

    sendPostToCreateErrorRes(req, res, resData) {
        this.sendPostErrorRes(req, res, resData, 422);
    }

    // PATCH

    sendPatchRes(req, res, status = 200) {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(status).end();
    }

    sendPatchErrorRes(req, res, status = 400) {
        switch (status) {
            case 415: {
                res.set('Accept-Patch', 'application/json-patch+json');
                res.set('Access-Control-Expose-Headers', 'Accept-Patch');
                break;
            }
            default: {
                break;
            }
        }
        this.sendPatchRes(req, res, status);
    }
}

module.exports = RequestHelper;
