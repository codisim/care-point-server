
set -o errexit


pnpm install
pnpm run build
npx prisma generate
npx prisma migrate deploy