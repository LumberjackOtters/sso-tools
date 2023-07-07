const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 3000
const path = require('path');
const cors = require('cors');

const database = require('./database.js');
const sp = require('./sp.js');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.use(
  session({
    secret: 'keyboard cat',
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);


app.use(function (req, res, next) {
  // Make `profile` available in templates
  res.locals.profile = req.session.profile;

  next();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

.get('/dashboard', function (req, res, next) {
  const { profile } = req.session;

  if (profile === undefined) {
    return res.redirect('/');
  }

  // Pass the profile to the view
  res.render('dashboard', {
    profile,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function getSp(code) {
  const spCode = code && code.toLowerCase();
  if (!spCode) return null;
  const Sps = await database.collection('sps');
  return await Sps.findOne({code: spCode});
}

// async function getUser(req, currentIdp) {
//   const cookie = req.cookies;
//   if (cookie && cookie.sessionId) {
//     const IdpUsers = await database.collection('idpUsers');
//     return await IdpUsers.findOne({'sessionIds': cookie.sessionId, idp: currentIdp._id});
//   }
//   return null;
// }

// async function getAttributes(idp) {
//   const IdpAttributes = await database.collection('idpAttributes');
//   const attributesCur = await IdpAttributes.find({ idp: idp._id });
//   const customAttributes = [];
//   await attributesCur.forEach(a => customAttributes.push(a));
//   return customAttributes;
// }

let apiController;
let oauthController;

const jacksonOptions = {
  externalUrl: 'http://localhost:3000',
  samlAudience: process.env.MONGO_DATABASE,
  samlPath: '/sso/acs',
  db: {
    engine: 'mongo',
    type: 'mongo',
    url: process.env.MONGO_URL
  },
};

(async function init() {
  const jackson = await require('@boxyhq/saml-jackson').controllers(jacksonOptions);

  apiController = jackson.apiController;
  oauthController = jackson.oauthController;
})();

// app.get('/config', async (req, res) => {
//   res.render('config');
// });

// app.post('/config', async (req, res, next) => {
//   const { rawMetadata, tenant, product } = req.body;

//   const defaultRedirectUrl = 'http://localhost:3000/sso/callback';
//   const redirectUrl = '["http://localhost:3000/*"]';

//   try {
//     await apiController.config({
//       rawMetadata,
//       tenant,
//       product,
//       defaultRedirectUrl,
//       redirectUrl,
//     });

//     res.redirect('/config');
//   } catch (err) {
//     next(err);
//   }
// });

app.post('/api/config', express.json(), async (req, res, next) => {
  const { rawMetadata, tenant, product } = req.body;

//   res.json({ tenant: tenant });

  const defaultRedirectUrl = 'http://localhost:3000/'+ tenant +'/'+ product +'/sso/callback';
  const redirectUrl = '["http://localhost:3000/*"]';

  try {
    await apiController.config({
      rawMetadata,
      tenant,
      product,
      defaultRedirectUrl,
      redirectUrl,
    });

    res.send({ rawMetadata: rawMetadata, tenant: tenant, product: product });

    // res.redirect('/config');
  } catch (err) {
    // console.log(err)
    res.status(400).send({ message: err.message });
    // next(err, express.json);
  }
});

app.get('/:tenant/:product/sso/authorize', async (req, res, next) => {
  let tenant = req.params.tenant
  let product = req.params.product

  try {
    // const tenant = 'keycloak';
    // const product = 'test';

    const body = {
      response_type: 'code',
      client_id: `tenant=${tenant}&product=${product}`,
      redirect_uri: 'http://localhost:3000/'+ tenant +'/'+ product +'/sso/callback',
      state: 'a-random-state-value',
    };

    const { redirect_url } = await oauthController.authorize(body);

    res.redirect(redirect_url);
  } catch (err) {
    next(err);
  }
});

app.post('/sso/acs', async (req, res, next) => {
  try {
    const { SAMLResponse, RelayState } = req.body;

    const body = {
      SAMLResponse,
      RelayState,
    };

    const { redirect_url } = await oauthController.samlResponse(body);

    res.redirect(redirect_url);
  } catch (err) {
    next(err);
  }
});

app.get('/:tenant/:product/sso/callback', async (req, res, next) => {
  const { code } = req.query;

  let tenant = req.params.tenant
  let product = req.params.product

  // const tenant = 'keycloak';
  // const product = 'test';

  const body = {
    code,
    client_id: `tenant=${tenant}&product=${product}`,
    client_secret: 'dummy',
    redirect_uri: 'http://localhost:3000/'+ tenant +'/'+ product +'/sso/callback',
  };

  try {
    // Get the access token
    const { access_token } = await oauthController.token(body);

    // Get the user information
    const profile = await oauthController.userInfo(access_token);

    // Add the profile to the express session
    req.session.profile = profile;

    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

// Log out
app.get('/logout', async (req, res, next) => {
  req.session.destroy();

  return res.redirect('/dashboard');
});
