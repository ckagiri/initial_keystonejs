/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

const bodyParser = require('body-parser');
const keystone = require('keystone');
const url = require('url');

const Config = require(`${global.__base}/config/Config`);
const conf = new Config();
const AppEnv = require(`${global.__base}/enum/AppEnv`);
const middleware = require('./middleware');

const importRoutes = keystone.importer(__dirname);
const Utility = require(`${global.__base}/helper/Utility`);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
const routes = {
    views: importRoutes('./views')
};

// Factory
const RestfulAPIFactory = require(`${global.__base}/routes/lib/RestfulAPIFactory`);

// Helpers
const apiRequestHelper = require(`${global.__base}/routes/lib/apiRequestHelper`);

// test
// const generateTestingMemberHandler = require(global.__base + '/routes/handler/test/generateTestingMember');

// api
// const loginHandler = require(global.__base + '/routes/handler/login');
// const registerHandler = require(global.__base + '/routes/handler/register');
// const authenticateHandler = require(global.__base +
//     '/routes/handler/authenticate');
// const changePasswordHandler = require(global.__base +
//     '/routes/handler/changePassword');
// const activateHandler = require(global.__base + '/routes/handler/activate');
// const sendActivationEmailHandler = require(global.__base +
//     '/routes/handler/sendActivationEmail');
// const profilePicturePoolHandler = require(global.__base +
//     '/routes/handler/profilePicturePool');
// const sendPasswordResetEmailHandler = require(global.__base +
//     '/routes/handler/sendPasswordResetEmail');
// const uploadProfilePictureHandler = require(global.__base +
//     '/routes/handler/uploadProfilePicture');
// const uploadBackgroundPictureHandler = require(global.__base +
//     '/routes/handler/uploadBackgroundPicture');
// const createGameAccountHandler = require(global.__base +
//     '/routes/handler/createGameAccount');
// const updateGameAccountHandler = require(global.__base +
//     '/routes/handler/updateGameAccount');
// const deleteGameAccountHandler = require(global.__base +
//     '/routes/handler/deleteGameAccount');
// const chatMessageHander = require(global.__base +
//     '/routes/handler/chatMessage');
// const memberHandler = require(global.__base +
//     '/routes/handler/member');

//news
// const { getNewsList, getNewsListByPage, getNewsById } = require(global.__base + '/routes/handler/news/newsGetRequest')

//twitch
// const {
//   getFeatureStream,
//   getStreamLive,
//   getStreamLiveByGame,
//   getTopGames,
//   getStreamByUser,
//   getStreamDetail
// } = require(global.__base + '/routes/handler/twitch/twitchGetRequest');
// const twitchHandler = require(global.__base + '/routes/handler/twitch/twitchAuth');
// const twitchConnect = require(global.__base + '/routes/handler/twitch/twitchConnect');
// const twitchDisconnect = require(global.__base + '/routes/handler/twitch/twitchDisconnect');

//luckyDraw
// const luckyDrawHandler = require(global.__base + '/routes/handler/LuckyDrawHandler');

//OG
// const tournamentDetailOgHandler = require(global.__base + '/routes/views/tournamentDetail');

//chatroom
// const getConversationListHandler = require(global.__base + '/routes/handler/conversation/getConversationList');

//sms
// const sendSmsAuthCodeHandler = require(global.__base + '/routes/handler/sendSmsAuthCode')
// const veriflySmsAuthCodeHandler = require(global.__base + '/routes/handler/veriflySmsAuthCode')

// Handlers
// const TournamentHandlers = require(global.__base +
//     '/routes/handler/tournament/tournamentHandlers');

// challonge api
// const createTournamentHandler = require(global.__base +
//     '/routes/handler/challonge/createTournament');
// const joinTournamentHandler = require(global.__base +
//     '/routes/handler/challonge/joinTournament');
// const waitingListJoinTournamentHandler = require(global.__base +
//     '/routes/handler/challonge/waitingListJoinTournament');
// const checkinTournamentHandler = require(global.__base +
//     '/routes/handler/challonge/checkinTournament');
// const tournamentPostRequestHandler = require(global.__base +
//     '/routes/handler/challonge/tournamentPostRequest');
// const tournamentGetRequestHandler = require(global.__base +
//     '/routes/handler/challonge/tournamentGetRequest');

    //leancloud
// const connectUserHandler = require(global.__base + '/routes/handler/leancloud/connectUser').requestConnectUser;
// const createConversationHandler = require(global.__base + '/routes/handler/leancloud/createConversation').reqCreateConversation;
// const controlConversationHandler = require(global.__base + '/routes/handler/leancloud/controlConversation');


// Setup Route Bindings
const indexRoute = function indexRoute(app) {
    if (process.env.APP_ENV !== 'production') {
        app.use(middleware.webpackDevMiddleware('app'));
        app.use(middleware.webpackHotMiddleware('app'));
    }

    if(conf.appEnv == AppEnv.production.key){
        app.all('*', ensureSecure);
        function ensureSecure(req, res, next){
            if(req.secure || req.headers["x-forwarded-proto"] === "https"){
              return next();
            };
            // handle port numbers if you need non defaults
            res.redirect('https://' + req.hostname + req.url); // express 4.x
        }
    }

    app.options('/*', (req, res) => {
        // res.set('Access-Control-Allow-Origin', '*');
        res.set(
            'Access-Control-Allow-Methods',
            'GET, POST, PATCH, PUT, DELETE'
        );
        res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.end();
    });

    app.patch('/*', bodyParser.json({ type: 'application/*+json' }));
    // api
    app.get('/api', (req, res) => {
        const urlObject = {
            protocol: conf.enableHttp ? 'http:' : 'https:',
            host: conf.appDomain
        };
        const urls = {};
        apiRequestHelper.sendGetRes(req, res, urls);
    });

    // app.all('/api/members*', (req, res, next) => {
    //     if (req.method === 'POST' && req.params[0] === '') {
    //         next();
    //     } else {
    //         authenticat eHandler()(req, res, next);
    //     }
    // });

    // app.use('*', authenticateHandler());

    //for routes views
    // app.get(
    //     `/games/:gameName/tournaments/:tournamentsId`, tournamentDetailOgHandler
    // );


    // app.get(
    //     `/${keystone.get('admin path')}/tournaments/challonge/:tournamentsId`,
    //     tournamentGetRequestHandler
    // );

    // app.post(
    //     `/${keystone.get(
    //         'admin path'
    //     )}/tournaments/:tournamentsId/process_check_ins`,
    //     tournamentPostRequestHandler
    // );
    // app.post(
    //     `/${keystone.get(
    //         'admin path'
    //     )}/tournaments/:tournamentsId/abort_check_in`,
    //     tournamentPostRequestHandler
    // );
    // app.post(
    //     `/${keystone.get('admin path')}/tournaments/:tournamentsId/start`,
    //     tournamentPostRequestHandler
    // );
    // app.post(
    //     `/${keystone.get('admin path')}/tournaments/:tournamentsId/next_phase`,
    //     tournamentPostRequestHandler
    // );
    // app.post(
    //     `/${keystone.get('admin path')}/tournaments/:tournamentsId/finalize`,
    //     tournamentPostRequestHandler
    // );
    // app.post(
    //     `/${keystone.get('admin path')}/tournaments/:tournamentsId/reset`,
    //     tournamentPostRequestHandler
    // );
    // app.post(
    //     `/${keystone.get('admin path')}/tournaments/:tournamentsId/participants/randomize`,
    //     tournamentPostRequestHandler
    // );

    // testing
    // app.post(
    //     '/api/test/generateTestingMembers',
    //     generateTestingMemberHandler
    // );
    //

    // picture pool
    // app.get('/api/members/:memberId/profilePool', (req, res) => {
    //     profilePicturePoolHandler.getPictureList(req, res);
    // });
    // chat message
    // app.get('/api/members/:memberId/chatMessages', (req, res) => {
    //     chatMessageHander.getChatMessageHistory(req, res);
    // });
    // app.post('/api/members/:memberId/sendChatMessage', (req, res) => {
    //     chatMessageHander.createChatMessage(req, res);
    // });

    // app.post(
    //     '/api/members/:memberId/profile_pictures',
    //     uploadProfilePictureHandler
    // );
    // app.post(
    //     '/api/members/:memberId/background_pictures',
    //     uploadBackgroundPictureHandler
    // );

    // app.post('/api/tournaments', createTournamentHandler);
    // app.post('/api/tournaments/:tournamentId/members', joinTournamentHandler);
    // app.post('/api/tournaments/:tournamentId/members/waiting_list', waitingListJoinTournamentHandler);
    // app.post(
    //     '/api/tournaments/:tournamentId/members/:memberId/check_in',
    //     checkinTournamentHandler
    // );

    // app.post('/api/members/sms', sendSmsAuthCodeHandler);
    // app.post('/api/members/sms/verifications', veriflySmsAuthCodeHandler);
    // //leancloud
    // app.post('/api/members/sign', connectUserHandler);
    // app.post('/api/members/conversation', createConversationHandler);
    // app.post('/api/members/conversation_controls', controlConversationHandler);

    // app.post('/api/login', loginHandler);
    // app.post('/api/members', registerHandler);
    // app.get('/api/members/:memberId/info', (req, res) => {
    //     memberHandler.getMemberInfo(req, res);
    // });
    // app.post('/api/members/:memberId/info', (req, res) => {
    //     memberHandler.updateMemberInfo(req, res);
    // });
    // app.post('/api/members/:memberId/password', changePasswordHandler);
    // app.post('/api/members/:memberId/game_accounts', createGameAccountHandler);
    // app.patch(
    //     '/api/members/:memberId/game_accounts/:gameAccountId',
    //     updateGameAccountHandler
    // );
    // app.patch(
    //     '/api/members/:memberId/delete_game_accounts/:gameAccountId',
    //     deleteGameAccountHandler
    // );
    // app.post('/api/activation_emails', sendActivationEmailHandler);
    // app.post('/api/password_reset_emails', sendPasswordResetEmailHandler);
    // app.put(
    //     '/api/members/:memberId/activation',
    //     authenticateHandler('activation'),
    //     activateHandler
    // );
    // app.all('/api/members/:memberId/*', (req, res, next) => {
    //     if (req.method === 'POST' && req.params[0] === '') {
    //         next();
    //     } else {
    //         authenticateHandler()(req, res, next);
    //     }
    // });

    // const tournamentHandlers = new TournamentHandlers(
    //     keystone.enhancedList('Tournament'),
    //     {
    //         basePath: 'api'
    //     }
    // );

    // app.get('/api/tournaments', tournamentHandlers.getListHandler());
    // app.get('/api/tournaments/:id', tournamentHandlers.getByIdHandler());
    // // app.get('/api/tournaments/:id/chatroom', getConversationHandler);
    // app.get('/api/tournaments/:tournamentId/chatroom/conversation', getConversationListHandler);

    // app.get('/api/news/newsList', getNewsList);
    // app.get('/api/news/newsById', getNewsById);
    // app.get('/api/news/newsListByPage', getNewsListByPage);

    // app.get('/api/twitch/featurestream', getFeatureStream);
    // app.get('/api/twitch/streamlive', getStreamLive);
    // app.get('/api/twitch/streamlivebygame', getStreamLiveByGame);
    // app.get('/api/twitch/topgames', getTopGames);
    // app.get('/api/twitch/access_token', twitchHandler.twitchAuth);
    // app.get('/api/twitch/connect', twitchConnect);
    // app.get('/api/twitch/disconnect', twitchDisconnect);
    // app.get('/api/twitch/streambyid', getStreamDetail);

    // app.get('/api/luckydraw/open', luckyDrawHandler.getLuckyDrawOpen);
    // app.post('/api/luckydraw', luckyDrawHandler.postLuckyDraw);
    // app.get('/api/luckydraw', luckyDrawHandler.getLuckyDrawParticipant);
    // app.get('/api/luckydraw/counter', luckyDrawHandler.getLuckyDrawCounter);

    // const restfulAPIFactory = new RestfulAPIFactory(app, 'api');
    // restfulAPIFactory.restify(keystone.enhancedList('Member'), {
    //     genPatch: true,
    //     genGet: false,
    // });
    // restfulAPIFactory.restify(keystone.enhancedList('Game'));
    // restfulAPIFactory.restify(keystone.enhancedList('Rule'));
    // restfulAPIFactory.restify(keystone.enhancedList('Country'));
    // restfulAPIFactory.restify(keystone.enhancedList('City'));
    // restfulAPIFactory.restify(keystone.enhancedList('Region'));
    // restfulAPIFactory.restify(keystone.enhancedList('Leaderboard'));
    // restfulAPIFactory.restify(keystone.enhancedList('HomeDynamicContent'));
    // restfulAPIFactory.restify(keystone.enhancedList('StaticPage'));
    // restfulAPIFactory.restify(keystone.enhancedList('Participant'));

    /*
    ** Views, handle for SEO data also
    ** Terry Chan@22/08/2018
    */
    // app.get('/games/:name/tournaments/:id', routes.views.tournamentDetail);
    // app.get('/news/:id', routes.views.newsDetail);
    // app.get('/live/channels/:channelId/:channelName', routes.views.liveChannel);
    // app.get('/live/games/:gameName/:channelId/:channelName', routes.views.liveChannel);
    // app.get('/luckydraw', routes.views.luckyDraw);
    // app.get('/luckydraw/:start', routes.views.luckyDraw);
    app.get('/*', routes.views.index);

    // import plugins' routes
    try {
        const pluginPath = `${global.__base}/plugins`;
        const plugins = Utility.getDirectories(pluginPath);
        plugins.forEach(plugin => {
            try {
                const pluginRoutesPath = `${global.__base}/plugins/${plugin}/routes.js`;
                const pluginRoutes = require(pluginRoutesPath);
                pluginRoutes(app);
            } catch (err) {
                console.log('Plugins routes.js not exist!');
            }
        });
    } catch (err) {
        console.log('Plugins folder not exist!');
    }
};

// import plugins' middleware
try {
    const pluginPath = `${global.__base}/plugins`;
    const plugins = Utility.getDirectories(pluginPath);
    plugins.forEach(plugin => {
        try {
            const pluginMiddlewarePath = `${global.__base}/plugins/${plugin}/middleware.js`;
            const pluginMiddleware = require(pluginMiddlewarePath);
            if (pluginMiddleware.preRoutes) {
                keystone.pre('routes', pluginMiddleware.preRoutes);
            }
            if (pluginMiddleware.preDynamic) {
                keystone.pre('dynamic', pluginMiddleware.preDynamic);
            }
            if (pluginMiddleware.preSignin) {
                keystone.pre('signin', pluginMiddleware.preSignin);
            }
        } catch (err) {
            console.log('Plugins middleware.js not exist!');
        }
    });
} catch (err) {
    console.log('Plugins folder not exist!');
}

exports = indexRoute;
module.exports = indexRoute;
