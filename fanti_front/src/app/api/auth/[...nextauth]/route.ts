import NextAuth from "next-auth";

const IS4Provider = {
  id: "is4",
  name: "IdentityServer4",
  type: "oauth",
  wellKnown: `https://connect-staging.fi-group.com/identity/.well-known/openid-configuration`,
  clientId: process.env.OAUTH2_CLIENTID || 'ext.local',
  issuer: process.env.OAUTH2_ISSUER || "https://connect-staging.fi-group.com/identity",
  authorization: {
    params: {
      scope: process.env.OAUTH2_SCOPE || "openid profile email",
      response_type: process.env.OAUTH2_RESPONSE_TYPE || "id_token token",
      redirect_uri: process.env.NEXTAUTH_URL || "http://localhost:3000/",
      state: Math.random().toString(36).substring(2) + Date.now().toString(36),
      nonce: Math.random().toString(36).substring(2) + Date.now().toString(36)
    }
  },
  idToken: true,
};

const handler = NextAuth({
  providers: [IS4Provider as any],
});

export { handler as GET, handler as POST };

