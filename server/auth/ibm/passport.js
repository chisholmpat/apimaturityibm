import passport from 'passport';
const OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
if (services !== undefined) {
	var ssoConfig = services.SingleSignOn[0];
	var client_id = ssoConfig.credentials.clientId;
	var client_secret = ssoConfig.credentials.secret;
	var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
	var token_url = ssoConfig.credentials.tokenEndpointUrl;
	var issuer_id = ssoConfig.credentials.issuerIdentifier;
	var callback_url = "https://apimaturitydev.mybluemix.net/auth/ibm/callback";      
}
  
export function setup(User, config) {
	if (services !== undefined) {
		passport.use(new OpenIDConnectStrategy({
	        authorizationURL : authorization_url,
	        tokenURL : token_url,
	        clientID : client_id,
	        scope: 'openid',
	        response_type: 'code',
	        clientSecret : client_secret,
	        callbackURL : callback_url,
	        skipUserProfile: true,
	        issuer: issuer_id
	    },
	    function(iss, sub, profile, accessToken, refreshToken, params, done)  {
	        process.nextTick(function() {
	            profile.accessToken = accessToken;
	            profile.refreshToken = refreshToken;
	            session.loggedInUserId = profile.id; //W3 ID
	            console.log(profile);
	            done(null, profile);
	        })
	    }));
	}
}