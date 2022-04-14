## Stack

- Typescript
- NextJS: React framework
- Chakra UI: UI library
- Prisma: Database ORM
- Planetscale: MySQL database
- tRPC ?

## Prisma Client

https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client
You need to re-run `prisma generate` command after every change that's made to your Prisma schema to update the generated Prisma Client code.

To seed the database:
`npx prisma db seed`

To update schema (https://www.prisma.io/planetscale):
`npx prisma db push`
(push to a branch in Planetscale, deploy to production afterwards)

pscale connect record-collector-db --port 3309
pscale connect record-collector-db --port 3310
