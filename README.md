<div align="center">
  <p>
  <img src="https://res.cloudinary.com/rxg/image/upload/v1701412436/smol-auth/smol-removebg-preview_1_ssj3gm.png" height="150"/>
  </p>
  <b> A smol authentication package with RBAC 🔐 </b>
</div>

## Guide to smol

#### Integrate smol-auth with your project

##### For Backend

1. Install the packages

        npm i smol-auth-express

2. Setup an env file with accessToken & RefreshToken secrets which are long strings. You can generate it by running the following commands:

        node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"

3. Initialize smol service

        import { validateUser, smol } from 'smol-auth-express';
        import express from 'express';

        const app = express();

        const smolConfig = {
          connectionUrl: process.env.DB_URL,
          accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
          refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
          clientDomain: process.env.WEBSITE_DOMAIN
        }

        smol()
          .init(app, smolConfig)

`Only Express & postgreSQL (auth db) is supported`

###### RBAC
1. Basic Role: To grant broad permissions to a role, use the `*` wildcard. For example:

        smol()
          .addRoles({
              admin: '*',
          }, { defaultRole: 'admin' })
          .init(app, smolConfig)

2. Multiple & Specific Roles: To specify permissions for a role on a particular route and method, use an array. For example:

        smol()
        .addRoles({
            admin: '*',
            user: [{ route: '/posts', method: '*' }],
            viewer: [{ route: '/posts', method: ['GET'] }]
        }, { defaultRole: 'viewer' })
        .init(app, smolConfig)

`Default Role is required for now`

##### For Frontend

1. Install the packages

        npm i smol-auth-client

2. Initialize smolClient

        import { smolClient } from 'smol-auth-client'

        smolClient(process.env.API_DOMAIN)

3. Use the corresponding functions

        import { signin, signup, getAuthId, signout } from 'smol-auth-client'
        
        const signupData = await signup(email, password)

        const signinData = await signin(email, password)
        
        const authId = await getAuthId()
        
        await signout()


#### Try with our example app

1. Clone the repo 

        git clone https://github.com/reenphygeorge/smol-auth

2. Install all required packages

        npm run install:all

3. Build smol-packages

        npm run build

4. Start Example API Service

        npm run start-example:api

5. Start Example Client Service

        npm run start-example:client

6. Connect [NocoDB](https://docs.nocodb.com/data-sources/connect-to-data-source/) to the auth db for dashboard

        http://localhost:8080

7. To stop docker containers after exit

        npm run docker:stop
