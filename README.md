## Stack

- Typescript
- NextJS: React framework
- Chakra UI: UI library
- Prisma: Database ORM
- Planetscale: MySQL database
- tRPC: End-to-end typesafe API

## Prisma Client

To seed the database:
`npx prisma db seed`

To update schema (https://www.prisma.io/planetscale):
`npx prisma db push`
(push to a branch in Planetscale, deploy to production afterwards)

Probably not needed:
https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client
You need to re-run `prisma generate` command after every change that's made to your Prisma schema to update the generated Prisma Client code.

## Planetscale - CLI useful commands

```
pscale auth login

pscale connect record-collector-db --port 3309

pscale connect record-collector-db --port 3310
```

## Planetscale - deployment

On your Planetscale dashboard, go to your main branch "Settings" and generate a new password. Copy the database, username, host and password values and use them to create an environment variable in Vercel with this format:

`DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@<HOST>/<DATABASE-NAME>?sslaccept=strict`

You can also copy the string from the option "Connect" and replace the password (and username if necessary)
