const customPopulate = function customPopulate(populateOption, keystoneList) {
    return populateOption.split(' ').reduce((self, path) => {
        if (
            keystoneList.fields[path] &&
            keystoneList.fields[path].options.populateSelectFields
        ) {
            return self.populate(
                path,
                keystoneList.fields[path].options.populateSelectFields
            );
        }
        return self.populate(path);
    }, this);
};

module.exports = {
    customPopulate
};
