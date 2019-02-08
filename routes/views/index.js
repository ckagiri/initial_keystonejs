const keystone = require('keystone');

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    const url = [req.protocol, req.headers.host].join('://');
    const logo = keystone.get('meta logo');
    const brand = keystone.get('brand');
    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'home';

    locals.meteDescription = `${brand}`;
    locals.ogTitle = brand;
    locals.ogDescription = locals.meteDescription;
    locals.ogUrl = [url, req.originalUrl].join('');
    locals.ogImage = [url, logo || '/images/icon/mtgamerlogo.png'].join('');
    // locals.ogImageWidth = '300';
    // locals.ogImageHeight = '40';
    // Render the view
    view.render('index', {
        adminPath: keystone.get('admin path')
    });
};
