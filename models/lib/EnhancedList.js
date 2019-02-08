const _ = require('lodash');
const keystone = require('keystone');
const jsonpatch = require('fast-json-patch');
const Joi = require('joi');

const utils = keystone.utils;

const MongooseQueryHelper = require(`${global.__base}/models/lib/MongooseQueryHelper`);

class EnhancedList {
    constructor(listName, listOptions = {}, resourceName = null) {
        const keystoneList = new keystone.List(listName, listOptions);
        const resources = resourceName || listName.toLowerCase();

        this._name = resources;
        this._language = 'zh-HK';
        this._pluralizedName = utils.plural(resources);
        this._keystoneList = keystoneList;
        this._model = null;
        this._defaultSelectOption = null;
        this._defaultRejectOption = null;
        this._defaultSortOption = null;
        this._defaultPaginateOption = {
            page: 1,
            perPage: 10
        };
        this._defaultPatchJoiSchema = null;
        this._childResources = [];
        this._plainChildResources = [];
        this._searchKeyword = '';
    }

    get name() {
        return this._name;
    }

    get language() {
        return this._language;
    }

    set language(language) {
        this._language = language;
    }

    get pluralizedName() {
        return this._pluralizedName;
    }

    get searchKeyword() {
        return this._searchKeyword;
    }

    set searchKeyword(keyword) {
        this._searchKeyword = keyword;
    }

    get keystoneList() {
        return this._keystoneList;
    }

    get model() {
        return this._model;
    }

    get childResources() {
        return this._childResources;
    }

    get plainChildResources() {
        return this._plainChildResources;
    }

    get defaultSelectOption() {
        return this._defaultSelectOption;
    }
    
    set defaultSelectOption(selectOption) {
        this._defaultSelectOption = selectOption;
    }

    get defaultRejectOption() {
        return this._defaultRejectOption;
    }
    set defaultRejectOption(rejectOption) {
        this._defaultRejectOption = rejectOption;
    }

    get defaultSortOption() {
        return this._defaultSortOption;
    }

    set defaultSortOption(sortOption) {
        this._defaultSortOption = sortOption;
    }

    get defaultPaginateOption() {
        return this._defaultPaginateOption;
    }

    set defaultPaginateOption(paginateOption) {
        this._defaultPaginateOption = paginateOption;
    }

    get defaultPatchJoiSchema() {
        return this._defaultPatchJoiSchema;
    }

    set defaultPatchJoiSchema(schema) {
        this._defaultPatchJoiSchema = schema;
    }

    add(schema) {
        this._keystoneList.add(...arguments);
    }

    register() {
        this._keystoneList.schema.query.customPopulate =
            MongooseQueryHelper.customPopulate;

        this._keystoneList.register();

        this._model = this._keystoneList.model;

        keystone.enhancedList().push(this);
    }

    addChildResource(resource) {
        this.childResources.push(resource);
    }

    getById(id, findOption, populateOption = '', selectOption = '') {

        let _options = selectOption;
        if(!!selectOption){
            if(!!this.defaultRejectOption){
                const _defaultRejectOption = this.defaultRejectOption.split(' ');
                const _defaultSelectOption = this.defaultSelectOption.split(' ');
                const _selectOption = selectOption.split(' ').concat(_defaultSelectOption);
                _options = _selectOption.filter((e)=>{
                    if(_defaultRejectOption.includes(`-${e}`)){
                        return false;
                    } else {
                        return true;
                    }
                }).join(' ');
                if(!_options){
                    _options = this.defaultSelectOption;
                }
            }
        }else{
            if(!!this._defaultSelectOption){
                _options =  this.defaultSelectOption;
            }
        }
        return this._model
            .find(findOption)
            .findOne({
                _id: id
            })
            .customPopulate(populateOption, this._keystoneList)
            .select(_options);
    }

    getList(findOption, sortOption, populateOption = '', selectOption = '') {
        let _options = selectOption;
        if(!!selectOption){
            if(!!this.defaultRejectOption){
                const _defaultRejectOption = this.defaultRejectOption.split(' ');
                const _defaultSelectOption = this.defaultSelectOption.split(' ');
                const _selectOption = selectOption.split(' ').concat(_defaultSelectOption);
                _options = _selectOption.filter((e)=>{
                    if(_defaultRejectOption.includes(`-${e}`)){
                        return false;
                    } else {
                        return true;
                    }
                }).join(' ');
                if(!_options){
                    _options = this.defaultSelectOption;
                }
            }
        }else{
            if(!!this._defaultSelectOption){
                _options =  this.defaultSelectOption;
            }
        }
        return this._model
            .find(findOption)
            .select(_options)
            .customPopulate(populateOption, this._keystoneList)
            .sort(sortOption || this.defaultSortOption);
    }

    getListByPage(findOption, sortOption, paginateOption, populateOption = '', selectOption = '') {
        if(selectOption !== ''){
            if(!!this.defaultSelectOption){
                selectOption = selectOption.split(' ').filter(field => this.defaultSelectOption.split(' ').map(e => e.replace('-', '')).indexOf(field) === -1).join(' ');
            }
        }
        const { page, perPage } = _.merge(
            {},
            this.defaultPaginateOption,
            paginateOption
        );
        return new Promise((resolve, reject) => {
            this._keystoneList
                .paginate({
                    page,
                    perPage,
                    filters: findOption
                })
                .select(selectOption)
                .customPopulate(populateOption, this._keystoneList)
                .sort(sortOption || this.defaultSortOption)
                .lean()
                .exec((err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        results.perPage = perPage;
                        resolve(results);
                    }
                });
        });
    }

    amendPatchForRemoveByValue(obj, patches) {
        const objToBeManipulated = JSON.parse(JSON.stringify(obj));

        patches.forEach(patch => {
            if (patch.op === 'remove-by-value') {
                const keys = patch.path.split('/');
                if (
                    patch.value &&
                    typeof patch.value === 'string' &&
                    keys.length === 2 &&
                    Array.isArray(objToBeManipulated[keys[1]])
                ) {
                    const index = objToBeManipulated[keys[1]].findIndex(
                        element => element.toString() === patch.value
                    );
                    if (index > -1) {
                        patch.op = 'remove';
                        patch.path = `${patch.path}/${index}`;
                        objToBeManipulated[keys[1]].splice(index, 1);
                        delete patch.value;
                    } else {
                        patch.op = 'test';
                    }
                } else {
                    patch.op = 'test';
                }
            }
        });
    }

    postToCreate(entity) {
        const newDoc = new this._model(entity);
        return newDoc.save();
    }

    patchById(id, findOption, patches) {
        return this.getById(id, findOption).exec().then(result => {
            let _patches = patches;
            if (!Array.isArray(_patches)) {
                _patches = [_patches];
            }

            this.amendPatchForRemoveByValue(result, _patches);

            const jsonPatchError = jsonpatch.validate(_patches, result);
            if (!jsonPatchError) {
                const patchRequestDefaultJoiSchema = Joi.object().keys({
                    op: Joi.string()
                        .valid(
                            'add',
                            'remove',
                            'replace',
                            'move',
                            'copy',
                            'test'
                        )
                        .required(),
                    path: Joi.string().required(),
                    value: Joi.any()
                });

                let joiSchema = patchRequestDefaultJoiSchema;
                if (this.defaultPatchJoiSchema) {
                    joiSchema = patchRequestDefaultJoiSchema.keys(
                        this.defaultPatchJoiSchema
                    );
                }

                let joiValidateResult = null;
                _patches.some(patch => {
                    joiValidateResult = Joi.validate(patch, joiSchema);
                    return joiValidateResult.error;
                });

                if (!joiValidateResult.error) {
                    jsonpatch.applyPatch(result, _patches);
                    return result.save();
                }
                return Promise.reject(joiValidateResult.error);
            }
            return Promise.reject(jsonPatchError);
        });
    }
}

module.exports = EnhancedList;
