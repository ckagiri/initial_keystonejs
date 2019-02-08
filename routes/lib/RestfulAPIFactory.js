const path = require('path');

const EnhancedList = require(`${global.__base}/models/lib/EnhancedList`);
const EnhancedListHandlers = require(`${global.__base}/routes/lib/EnhancedListHandlers`);

class RestfulAPIFactory {
    constructor(expressApp, dir) {
        this._app = expressApp;
        this._dir = dir;
    }

    restify(
        enhancedList,
        {
            genGet = true,
            genGetId = true,
            genPost = false,
            genPatch = false,
            // genDelete = false,
            genSearch = false
        } = {}
    ) {
        if (enhancedList instanceof EnhancedList) {
            const enhancedListHandlers = new EnhancedListHandlers(
                enhancedList,
                {
                    basePath: this._dir
                }
            );

            if (genGet) {
                this._app.get(
                    path.join('/', this._dir, enhancedList.pluralizedName),
                    enhancedListHandlers.getListHandler()
                );
                
            }
            if(genGetId){
                this._app.get(
                    path.join(
                        '/',
                        this._dir,
                        enhancedList.pluralizedName,
                        ':id'
                    ),
                    enhancedListHandlers.getByIdHandler()
                );
            }
            if (genPost) {
                this._app.post(
                    path.join('/', this._dir, enhancedList.pluralizedName),
                    enhancedListHandlers.postToCreateHandler()
                );
            }

            if (genPatch) {
                this._app.patch(
                    path.join(
                        '/',
                        this._dir,
                        enhancedList.pluralizedName,
                        ':id'
                    ),
                    enhancedListHandlers.patchByIdHandler()
                );
            }

            if (genSearch) {
                this._app.get(
                    path.join(
                        '/',
                        this._dir,
                        'search',
                        enhancedList.pluralizedName
                    ),
                    enhancedListHandlers.searchHandler()
                );
            }

            if (enhancedList.childResources.length > 0) {
                enhancedList.childResources.forEach(childResource => {
                    const childEnhancedListHandlers = new EnhancedListHandlers(
                        childResource.enhancedList,
                        {
                            basePath: this._dir
                        }
                    );

                    if (childResource.genGet) {
                        this._app.get(
                            path.join(
                                '/',
                                this._dir,
                                enhancedList.pluralizedName,
                                ':id',
                                childResource.enhancedList.pluralizedName
                            ),
                            (req, res) => {
                                childEnhancedListHandlers.getListHandler({
                                    [childResource.ref]: req.params.id
                                })(req, res);
                            }
                        );

                        this._app.get(
                            path.join(
                                '/',
                                this._dir,
                                enhancedList.pluralizedName,
                                ':parent_id',
                                childResource.enhancedList.pluralizedName,
                                ':id'
                            ),
                            (req, res) => {
                                childEnhancedListHandlers.getByIdHandler({
                                    [childResource.ref]: req.params.parent_id
                                })(req, res);
                            }
                        );
                    }

                    if (childResource.genPost) {
                        this._app.post(
                            path.join(
                                '/',
                                this._dir,
                                enhancedList.pluralizedName,
                                ':id',
                                childResource.enhancedList.pluralizedName
                            ),
                            (req, res) => {
                                childEnhancedListHandlers.postToCreateHandler({
                                    [childResource.ref]: req.params.id
                                })(req, res);
                            }
                        );
                    }
                });
            }
        }
    }
}

module.exports = RestfulAPIFactory;
