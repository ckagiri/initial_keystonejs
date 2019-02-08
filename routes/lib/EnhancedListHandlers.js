const url = require('url');
const path = require('path');
const _ = require('lodash');

const Locale = require(`${global.__base}/enum/Locale`);
const apiRequestHelper = require(`${global.__base}/routes/lib/apiRequestHelper`);

class EnhancedListHandlers {
    constructor(enhancedList, handlerOptions) {
        this._enhancedList = enhancedList;
        this._options = Object.assign(
            {},
            {
                basePath: ''
            },
            handlerOptions
        );
    }

    get enhancedList() {
        return this._enhancedList;
    }

    get options() {
        return this._options;
    }

    _innerLocalize(req, data) {
        let language = this.enhancedList.language;
        if (req.headers['accept-language']) {
            const acceptLanguage = req.headers['accept-language'];

            let index = -1;
            Locale.enums.forEach(data => {
                const ocurrenceIndex = acceptLanguage.indexOf(data.key);
                if (
                    ocurrenceIndex > -1 &&
                    (index === -1 || ocurrenceIndex < index)
                ) {
                    index = ocurrenceIndex;
                    language = data.key;
                }
            });
        }

        Object.keys(data)
            .filter(key =>
                Locale.enums.every(locale => !key.endsWith(`_${locale.key}`))
            )
            .forEach(key => {
                data[key] = data[`${key}_${language}`] || data[key];
                Locale.enums.forEach(locale => delete data[`${key}_${locale}`]);
            });
    }

    localize(req, data) {
        this._innerLocalize(req, data);

        if (req.query.populate) {
            req.query.populate.split(' ').forEach(path => {
                if (typeof data[path] === 'object' && data[path]) {
                    if (Array.isArray(data[path])) {
                        data[path].forEach(item =>
                            this._innerLocalize(req, item)
                        );
                    } else {
                        this._innerLocalize(req, data[path]);
                    }
                }
            });
        }

        delete data.locale;
    }

    addLinkObject(req, data) {
        if (this.enhancedList.childResources.length > 0) {
            const urlObject = apiRequestHelper.getUrlObject(req);
            this.enhancedList.childResources.forEach(childResource => {
                data[
                    `${childResource.enhancedList.pluralizedName}_url`
                ] = url.format(
                    Object.assign({}, urlObject, {
                        pathname: path.join(
                            this.options.basePath,
                            this.enhancedList.pluralizedName,
                            data._id.toString(),
                            childResource.enhancedList.pluralizedName
                        )
                    })
                );
            });
        }

        if (this.enhancedList.plainChildResources.length > 0) {
            const urlObject = apiRequestHelper.getUrlObject(req);
            this.enhancedList.plainChildResources.forEach(
                plainChildResource => {
                    data[`${plainChildResource}_url`] = url.format(
                        Object.assign({}, urlObject, {
                            pathname: path.join(
                                this.options.basePath,
                                this.enhancedList.pluralizedName,
                                data._id.toString(),
                                plainChildResource
                            )
                        })
                    );
                }
            );
        }
    }

    processResult(req, data) {
        if (data) {
            this.localize(req, data);
            this.addLinkObject(req, data);
        }
    }

    processArrayResult(req, data) {
        if (Array.isArray(data)) {
            data.forEach(datum => this.processResult(req, datum));
        }
    }

    getByIdHandler(findOption) {
        return (req, res) => {
            const query = JSON.parse(JSON.stringify(req.query));
            const { populate } = query;
            var { select } = query;
            delete query.populate;
            delete query.select;

            this.enhancedList
                .getById(
                    req.params.id,
                    Object.assign({}, query, findOption),
                    populate,
                    select
                )
                .lean()
                .exec()
                .then(result => {
                    this.processResult(req, result);
                    apiRequestHelper.sendGetRes(req, res, result);
                })
                .catch(err => {
                    console.log(err);
                });
        };
    }

    getListHandler(findOption) {
        return (req, res) => {
            const query = JSON.parse(JSON.stringify(req.query));
            const { sort, populate, page, perPage, select } = query;

            delete query.sort;
            delete query.page;
            delete query.perPage;
            delete query.populate;
            delete query.select;

            if (page === '-1') {
                this.enhancedList
                    .getList(
                        Object.assign({}, query, findOption),
                        sort,
                        populate,
                        select
                    )
                    .lean()
                    .exec()
                    .then(results => {
                        this.processArrayResult(req, results);
                        apiRequestHelper.sendGetRes(req, res, results);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                const paginateOption = {
                    page,
                    perPage
                };

                this.enhancedList
                    .getListByPage(
                        Object.assign({}, query, findOption),
                        sort,
                        paginateOption,
                        populate,
                        select
                    )
                    .then(paginateResult => {
                        const { results } = paginateResult;
                        delete paginateResult.results;
                        this.processArrayResult(req, results);
                        apiRequestHelper.sendPaginationGetRes(
                            req,
                            res,
                            results,
                            paginateResult
                        );
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        };
    }

    postToCreateHandler(entity = {}) {
        return (req, res) => {
            this.enhancedList
                .postToCreate(Object.assign({}, req.body, entity))
                .then(result => {
                    apiRequestHelper.sendPostToCreateRes(
                        req,
                        res,
                        result._id.toString()
                    );
                })
                .catch(err => {
                    apiRequestHelper.sendPostToCreateErrorRes(req, res, {
                        message: err.message
                    });
                });
        };
    }

    patchByIdHandler() {
        return (req, res) => {
            if (req.headers['content-type'] !== 'application/json-patch+json') {
                apiRequestHelper.sendPatchErrorRes(req, res, 415);
                return;
            }

            this.enhancedList
                .patchById(req.params.id, req.qeury, req.body)
                .then(() => {
                    apiRequestHelper.sendPatchRes(req, res, 200);
                })
                .catch(() => {
                    apiRequestHelper.sendPatchErrorRes(req, res);
                });
        };
    }

    searchHandler() {
        return (req, res) => {
            if (!req.query.q || this.enhancedList.searchKeyword === '') {
                res.status(422);
                apiRequestHelper.sendGetRes(req, res, {
                    message: 'Invalid Parameter'
                });
            } else {
                const q = new RegExp(req.query.q, 'i');

                this.getListHandler({
                    [this.enhancedList.searchKeyword]: q,
                    q: null
                })(req, res);
            }
        };
    }
}

module.exports = EnhancedListHandlers;
