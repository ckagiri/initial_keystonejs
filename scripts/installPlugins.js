const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const async = require('async');
const path = require('path');

let pluginData;
try {
    pluginData = require(path.resolve('./plugin.json'));
} finally {
    if (pluginData) {
        execSync('rm -rf plugins');
        async.forEachOf(
            pluginData,
            (value, key, callback) => {
                // extract path, tag name
                const tagStart = value.indexOf('#');
                let tag = null;
                let gitRemoteUrl = value;
                let cmd = 'sh scripts/installPlugins.sh ';
                const args = [];
                if (tagStart !== -1) {
                    tag = value.substr(
                        tagStart + 1,
                        value.length - (tagStart + 1)
                    );
                    gitRemoteUrl = value.substr(0, tagStart);
                    args.push({
                        option: '-t',
                        value: tag
                    });
                }
                args.push({
                    option: '-n',
                    value: key
                });
                args.push({
                    option: '-p',
                    value: gitRemoteUrl
                });

                cmd += args.map(arg => `${arg.option} ${arg.value}`).join(' ');
                // execute installPlugin.sh
                exec(cmd, (e, stdout, stderr) => {
                    if (e instanceof Error) {
                        console.error(e);
                        throw e;
                    }
                    console.log('stdout ', stdout);
                    console.log('stderr ', stderr);
                    callback();
                });
            },
            err => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }
}
