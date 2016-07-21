import raven from 'raven';
import newrelic from 'newrelic';
import Express from 'express';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Location from 'react-router/lib/Location';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import api from './api/api';
import ApiClient from './ApiClient';
import universalRouter from './universalRouter';
import Html from './Html';
import PrettyError from 'pretty-error';

const pretty = new PrettyError();
const app = new Express();
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:' + config.apiPort
});


if ( (app.get('env') === 'production') || (app.get('env') === 'staging') ) {
  // The request handler must be the first item
  app.use(raven.middleware.express.requestHandler(process.env.SENTRY_DSN));
}

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(require('serve-static')(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res);
});

app.get(/\/users|\/pt\/users|\/membros/, function(req, res) {
  res.redirect('/')
});

app.get('/robots.txt', function(req, res) {
  res.send('User-Agent: * \n' +
    'Allow: /')
});


// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  console.log('proxy error', error);
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
});


if ( (app.get('env') === 'production') || (app.get('env') === 'staging') ) {
  // The error handler must be before any other error middleware
  app.use(raven.middleware.express.errorHandler(process.env.SENTRY_DSN));
}

app.use((req, res, next) => {
  const host = req.headers.host
  const isAppSubdomain = host.indexOf(`app.${process.env.APP_DOMAIN}`) !== -1
  const www = host.match(/^www\./)
  const domains = fs.readFileSync('./src/redirect.blacklist')
  const lines = domains.toString().split('\n')
  const blacklist = lines.some(line => { if (line) return host.match(line) })

  if (!isAppSubdomain && !__DISABLE_SSR__ && !www && !blacklist) {
    res.redirect(301, `${req.protocol}://www.${host}`)
    return
  }
  next()
})

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }

  const client = new ApiClient(req);
  const store = createStore(client);
  const location = new Location(req.path, req.query);
  if (__DISABLE_SSR__) {
    res.send('<!doctype html>\n' +
      ReactDOMServer.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={<div/>} store={store}/>));
  } else {
    universalRouter(location, undefined, store, req.headers.host)
      .then(({component, transition, isRedirect}) => {
        if (isRedirect) {
          res.redirect(transition.redirectInfo.pathname);
          return;
        }
        res.send('<!doctype html>\n' +
          ReactDOMServer.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      })
      .catch((error) => {
        if (error.redirect) {
          res.redirect(error.redirect);
          return;
        }
        console.error('ROUTER ERROR:', pretty.render(error));
        res.status(500).send({error: error.stack});
      });
  }
});

if (config.port) {
  app.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    } else {
      api().then(() => {
        console.info('==> ✅  Server is listening');
        console.info('==> 🌎  %s running on port %s, API on port %s', config.app.name, config.port, config.apiPort);
        console.info('----------\n==> 💻  Open http://localhost:%s in a browser to view the app.', config.port);
      });
    }
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
