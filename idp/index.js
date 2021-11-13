const express = require('express')
const { ObjectId } = require('mongodb'); // or ObjectID 
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');

const database = require('./database.js');
const idp = require('./idp.js');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

function pageTemplate(content) {
  return `<!DOCTYPE html><html><head>
    <title>SSO Tools IDP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="icon" href="https://sso.tools/icon.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
  </head><body> <div class="container">${content}</div></body></html>`;
}

function loginForm(res, requestId, currentIdp, currentSp, error) {
  res.status(error ? 401 : 200).send(
    pageTemplate(
      `<h2>${currentSp ? `Login to access ${currentSp.name}`:'Login'}</h2><h5>You're authenticating with ${currentIdp ? currentIdp.name: ''}</h5> 
      ${currentSp ? '<p>After you\'ve logged-in, you\'ll be redirected back to '+currentSp.name+'.</p>' : ''}
      ${error ? `<p style="color:red;">${error}</p>` : ''}
      <form method="post" action="/${currentIdp.code}/${currentSp ? `saml/login` : 'login'}">
      <input name="email" type="email" placeholder="Email address"/> <input name="password" type="password" placeholder="Password"/>
      <input name="requestId" type="hidden" value="${requestId}" />
      <button type="submit" value="Login" class="waves-effect waves-light btn">Login</button>
      </form>`
    ),
  );
}

function errorPage(res, message, status) {
  res.status(status || 400).send(pageTemplate(`<h4>There was a problem fulfilling your request.</h3><h4>${message}</h4>`));
}

async function getIdp(code) {
  const idpCode = code && code.toLowerCase();
  if (!idpCode) return null;
  const Idps = await database.collection('idps');
  return await Idps.findOne({code: idpCode});
}

async function getUser(req, currentIdp) {
  const cookie = req.cookies;
  if (cookie && cookie.sessionId) {
    const IdpUsers = await database.collection('idpUsers');
    return await IdpUsers.findOne({'sessionIds': cookie.sessionId, idp: currentIdp._id});
  }
  return null;
}

async function getAttributes(idp) {
  const IdpAttributes = await database.collection('idpAttributes');
  const attributesCur = await IdpAttributes.find({ idp: idp._id });
  const customAttributes = [];
  await attributesCur.forEach(a => customAttributes.push(a));
  return customAttributes;
}

async function sendAssertion(res, user, requestId, thisIdp, thisSp, sessionId) {
  const attributes = {
    'firstName': user.firstName,
    'lastName': user.lastName,
    'email': user.email,
  };

  const customAttributes = await getAttributes(thisIdp);
  customAttributes.forEach(a => {
    const key = a.samlMapping || a.name;
    if (key) {
      const value = (user.attributes && user.attributes[a._id]) || a.defaultValue;
      if (value) attributes[key] = value;
    }
  });

  const assertion = idp.createAssertion({
    key: thisIdp.saml.privateKey,
    cert: thisIdp.saml.certificate,
    issuer: `https://idp.sso.tools/${thisIdp.code}`,
    recipient: thisSp.entityId,
    audiences: thisSp.entityId,
    inResponseTo: requestId,
    authnContextClassRef: 'urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified',
    nameIdentifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    nameIdentifier: user.email,
    sessionExpiration: new Date(Date.now() + parseInt(10000) * 1000 * 60).toISOString(),
    sessionIndex: ('sso_tools_session' + (Math.random() * 10000000)).replace('.', '_'),
    lifetimeInSeconds: 600,
    attributes: attributes
  });
  const response = idp.createResponse({
    instant: new Date().toISOString().trim(),
    issuer: `https://idp.sso.tools/${thisIdp.code}`,
    inResponseTo: requestId,
    destination: thisSp.callbackUrl,
    assertion: assertion,
    samlStatusCode: 'urn:oasis:names:tc:SAML:2.0:status:Success',
    samlStatusMessage: 'Login successful',
  });
  const encoded = Buffer.from(response).toString('base64');

  res.append('Set-Cookie', `sessionId=${sessionId}; Path=/`);
  res.send(
    pageTemplate(
      `<h3>Authentication successful</h3><h5>Contacting the Service Provider...</h5>
      <form action="${thisSp.callbackUrl}" method="post">
        <input type="hidden" name="SAMLResponse" value="${encoded}" />
      </form>
      <script>document.querySelector('form').submit();</script>`
    )
  );
}

//module.exports.root = async (event) => {
app.get('/:code', async (req, res) => {
  const thisIdp = await getIdp(req.params.code);
  if (!thisIdp) return errorPage(res, `There is no IDP service available at this URL.`, 404);
  const user = await getUser(req, thisIdp); 

  const sps = [];
  if (user) {
    const IdpSps = await database.collection('idpSps');
    const cur = await IdpSps.find({idp: thisIdp._id}, {name: 1, serviceUrl: 1, entityId: 1});
    await cur.forEach(s => sps.push(s));
  }
  res.send(pageTemplate(`<div>
    <h2>Welcome to ${thisIdp.name}</h2>
    ${user ? `
      <p>You're logged-in as ${user.firstName} ${user.lastName}</p>
      <a class='btn' style="float:right;" href="/${thisIdp.code}/logout">Logout of ${thisIdp.name}</a>
      <div style="clear:both;margin: 20px auto;"></div>
      ${sps.length > 0 ? `
        <h4>Available Service Providers</h4>
        <table>
          <thead><tr><th>Name</th><th></th></thead>
          <tbody>
            ${sps.map(s => 
              `<tr>
              <td>${s.name}</td>
              <td style="text-align:right;"><a class='btn blue' href="${s.serviceUrl}">Visit Service</a><a class='btn green' href="https://idp.sso.tools/${thisIdp.code}/saml/login/initiate?entityId=${s.entityId}" style="margin-left: 10px;">IDP-initiated login</a></td></tr>`
            )}
          </tbody>
        </table>
      ` : `
        <h4>This IDP has no Service Providers registered</h4>
      `}
    ` : `
      <h4>You're not currently logged-in to this IDP</h4>
      <h5 style="margin-top: 40px;">Login below</h5>
      <form method="post" action="/${thisIdp.code}/login">
      <input name="email" type="email" placeholder="Email address"/> <input name="password" type="password" placeholder="Password"/>
      <button type="submit" value="Login" class="waves-effect waves-light btn">Login</button>
      </form>
    `}
  </div>`));
});

//module.exports.handleLoginRequest = async (event, context, callback) => {
app.get('/:code/saml/login/request', async (req, res) => {
  try{
    const request = req.query.SAMLRequest;
    const relayState = req.query.relayState;
    const info = idp.parseRequest({}, request);

    if (relayState) { }
    if (info.logout) {
      return errorPage(res, 'This endpoint cannot be used to handle logout requests. Please use /logout/request instead.');
    }

    if (info.login) {
      const fields = info.login;
      const Requests = await database.collection('requests');
      const result = await Requests.insertOne(info);
      const thisIdp = await getIdp(req.params.code);
      if (!thisIdp) return errorPage(res, `There is no IDP service available at this URL.`, 404);

      const IdpSps = await database.collection('idpSps');
      const thisSp = await IdpSps.findOne({idp: thisIdp._id, entityId: fields.issuer});
      if (!thisSp) return errorPage(res, `The Service Provider requesting authentication is not currently registered with the IDP ${thisIdp.name}. If you think you are seeing this message in error, please check your Service Provider configuration. For reference, the issuer of the authentication request is "${fields.issuer}"`);
      if (!fields.forceAuthn) {
        const user = await getUser(req, thisIdp);
        if (user) {
          const sessionId = uuidv4();
          const IdpUsers = await database.collection('idpUsers');
          await IdpUsers.updateOne({_id: user._id}, {$addToSet: {sessionIds: sessionId}});
          return await sendAssertion(res, user, result.insertedId, thisIdp, thisSp, sessionId);
        }
      }
      return loginForm(res, result.insertedId, thisIdp, thisSp);
    }
  }
  catch(err) {
    console.log(err)
    return errorPage(res, 'The request from your service provider could not be understood.');
  }
});

//module.exports.handleLogoutRequest = async(event, context, callback) => {
app.get('/:code/saml/logout/request', async (req, res) => {
  try{
    const request = req.query.SAMLRequest;
    const relayState = req.query.RelayState;
    const thisIdp = await getIdp(req.params.code);
    if (!thisIdp) return errorPage(res, `There is no IDP service available at this URL.`);
    const info = idp.parseRequest({ issuer: `https://idp.sso.tools/${thisIdp.code}` }, request);

    if (info.login) {
      return errorPage(res, 'This endpoint cannot be used to handle login requests. Please use /logout/login instead.');
    }
    if (info.logout) {
      const fields = info.logout;
      

      const IdpSps = await database.collection('idpSps');
      const thisSp = await IdpSps.findOne({idp: thisIdp._id, entityId: fields.issuer});
      if (!thisSp) return errorPage(res, `The Service Provider requesting authentication is not currently registered with the IDP ${thisIdp.name}. If you think you are seeing this message in error, please check your Service Provider configuration. For reference, the issuer of the authentication request is "${fields.issuer}"`);

      if (!fields.nameId) return errorPage(res, 'No NameID was included in the logout request.');
      const user = await getUser(req, thisIdp);
      if (!user) return errorPage(res, 'The user is not currently logged-in with this IDP.', 401);
      if (user.email.toLowerCase() !== fields.nameId.toLowerCase()) return errorPage(res, 'The currently logged-in user does not match the user making the logout request.', 403);

      const IdpUsers = await database.collection('idpUsers');
      await IdpUsers.updateOne({_id: user._id}, {$unset: {sessionIds: ''}});  

      const encodedResponse = Buffer.from(fields.response).toString('base64');
      return {
        statusCode: 302,
        headers: { 
          'Location': `${thisSp.serviceUrl ? `${thisSp.serviceUrl}?SAMLResponse=${encodedResponse}` : `/${thisIdp.code}`}`,
          'Set-Cookie': 'sessionId=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        },
      };
    }
  }
  catch(err) {
    console.log(err);
    return errorPage(res, 'The request from your service provider could not be understood.');
  }
});

//module.exports.idpInitiatedLogin = async (event, context, callback) => {
app.get('/:code/saml/login/initiate', async (req, res) => {
  if (!req.query.entityId) return errorPage(res, 'No entityId was provided');
  const thisIdp = await getIdp(req.params.code);
  if (!thisIdp) return errorPage(res, `There is no IDP service available at this URL.`, 404);
  const user = await getUser(req, thisIdp);
  if (!user) return errorPage(res, 'You aren\'t currently logged-in.', 401);
  const IdpSps = await database.collection('idpSps');
  const thisSp = await IdpSps.findOne({idp: user.idp, entityId: req.query.entityId });
  if (!thisSp) return errorPage(res, 'There is no SP with the given EntityID', 404);

  const sessionId = uuidv4();
  const IdpUsers = await database.collection('idpUsers');
  await IdpUsers.updateOne({_id: user._id}, {$addToSet: {sessionIds: sessionId}});

  return await sendAssertion(res, user, null, thisIdp, thisSp, sessionId);
});

//module.exports.spInitiatedLogin = async (event, context, callback) => {
app.post('/:code/saml/login', async (req, res) => {
  const Requests = await database.collection('requests');
  const request = await Requests.findOne({'_id': ObjectId(req.body.requestId)});
  if (!request) return loginForm(res, req.body.requestId, null, null, 'This login request is not valid.');
  
  const thisIdp = await getIdp(req.params.code);
  if (!thisIdp) return errorPage(res, `There is no IDP service available at this URL.`, 404);

  const IdpSps = await database.collection('idpSps');
  const thisSp = await IdpSps.findOne({idp: thisIdp._id, entityId: request.login.issuer});
  if (!thisSp) return errorPage(res, `The Service Provider requesting authentication is not currently registered with the IDP ${thisIdp.name}. If you think you are seeing this message in error, please check your Service Provider configuration. For reference, the issuer of the authentication request is "${request.login.issuer}"`);

  const IdpUsers = await database.collection('idpUsers');
  const user = await IdpUsers.findOne({email: req.body.email.toLowerCase(), idp: thisIdp._id });

  if (!user || !bcrypt.compareSync(req.body.password, user.password.toString())) {
    return loginForm(res, req.body.requestId, thisIdp, thisSp, 'The email address or password is incorrect. Remember that you need to login as a user registered with the IDP, and not your SSO Tools account.');
  }
  const sessionId = uuidv4();
  await IdpUsers.updateOne({_id: user._id}, {$addToSet: {sessionIds: sessionId}});

  return await sendAssertion(res, user, request._id, thisIdp, thisSp, sessionId);
});

//module.exports.login = async (event) => {
app.post('/:code/login', async (req, res) => {
  const thisIdp = await getIdp(req.params.code);
  if (!thisIdp) return errorPage(res, `There is no IDP service available at this URL.`, 404);

  const IdpUsers = await database.collection('idpUsers');
  const user = await IdpUsers.findOne({email: req.body.email.toLowerCase(), idp: thisIdp._id });

  if (!user || !bcrypt.compareSync(req.body.password, user.password.toString())) {
    return loginForm(res, null, thisIdp, null, 'The email address or password is incorrect. Remember that you need to login as a user registered with the IDP, and not your SSO Tools account.');
  }
  const sessionId = uuidv4();
  await IdpUsers.updateOne({_id: user._id}, {$addToSet: {sessionIds: sessionId}});
  res.append('Set-Cookie', `sessionId=${sessionId}; Path=/`);
  res.redirect(`/${thisIdp.code}`);
});

//module.exports.logout = async (event) => {
app.get('/:code/logout', async (req, res) => {
  const thisIdp = await getIdp(req.params.code);
  const user = await getUser(req, thisIdp);
  if (user) {
    const IdpUsers = await database.collection('idpUsers');
    await IdpUsers.updateOne({_id: user._id}, {$unset: {sessionIds: ''}});  
  }
  res.append('Set-Cookie', 'sessionId=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.redirect(`/${thisIdp.code}`);
});

const port = 6001;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
