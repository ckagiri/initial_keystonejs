#bash
apt-get install libkrb5-dev
npm install
npm install lodash --save
npm install git://github.com/gemscng/keystone.git#v4.0.0-beta.6_4d --save
npm rebuild node-sass node-sass-middleware
npm run install-plugins
npm run build-prod
pm2 kill
pm2 start PM2Processes/cms_processes_prod.json 