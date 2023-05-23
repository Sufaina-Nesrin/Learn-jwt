# Getting Started with JWT(JSON WEB TOKEN)
# ----------------------------------------

Consider a JWT like a hotel key: When you enter the hotel, first you need to register yourself at the reception to receive your key card. You can use that key card to open and close your room, access common amenities like Bar, Fitness Centre, etc. But you cannot use that key card to access someone else’s room or Manager’s office since you are not authorized to do so. The key card comes with an expiration date, and it becomes useless once your stay has ended at the hotel.
Similarly, you can use your JWT token generated from one server to access resources on different servers. The JWT token contains claims like expiration date/time that can be used to check its validity..

## Anatomy of the JWT

A JSON Web Token is nothing but a long encoded text string which is made up of three parts separated by a period. These parts are:
**Header**
**Payload**
**Signature**

A typical JWT looks like the following:
header.payload.signature

### Header

The header consists of two parts i.e. the type of token and the algorithm used for signing (such as HMAC SHA256 or RSA). The token type helps to interpret the token and in this case it’s JWT. For example,
{
"typ": "JWT",
"alg": "HS256"
}
_This header is then encoded into base64 to form the first part of the JWT._

### Payload

The payload consists of the session data called as claims. Claims provide information about the client/user. There are three types of claims: registered, public, and private claims.
An example of payload is as follows:
{
"sub": "user123",
"name": "John",
"role": "developer",
"exp": "1606595460",
}

### Signature

To create the signature part you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.
For example if you want to use the HMAC SHA256 algorithm, the signature will be created in the following way:

HMACSHA256(
base64UrlEncode(header) + "." +
base64UrlEncode(payload),
secret)

## putting alltogether

The output is three Base64-URL strings separated by dots that can be easily passed in HTML and HTTP environments, while being more compact when compared to XML-based standards such as SAML.

it has the **header** and **payload** encoded, and it is signed with a **secret**.

## How do JSON Web Tokens work?

In authentication, when the user successfully logs in using their credentials, a JSON Web Token will be returned. Since tokens are credentials, great care must be taken to prevent security issues. In general, you should not keep tokens longer than required.

You also should not store sensitive session data in browser storage due to lack of security.

Whenever the user wants to access a protected route or resource, the user agent should send the JWT, typically in the Authorization header using the Bearer schema. The content of the header should look like the following:

Authorization: Bearer <token>
This can be, in certain cases, a stateless authorization mechanism. The server's protected routes will check for a valid JWT in the Authorization header, and if it's present, the user will be allowed to access protected resources. If the JWT contains the necessary data, the need to query the database for certain operations may be reduced, though this may not always be the case.

Note that if you send JWT tokens through HTTP headers, you should try to prevent them from getting too big. Some servers don't accept more than 8 KB in headers. If you are trying to embed too much information in a JWT token, like by including all the user's permissions, you may need an alternative solution, like Auth0 Fine-Grained Authorization.
