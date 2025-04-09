# Dvc Assesment

## 💪 Stack

- **[NestJS](https://nestjs.com/)** – A progressive Node.js framework
- **[Prisma](https://www.prisma.io/)** – Modern database ORM
- **[GraphQL](https://graphql.org/)** – Flexible API query language
- **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)** – Integration with GraphQL

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/williamsgqdev/Dvc-Assesment
cd Dvc-Assesment
```

### 2. Install Dependencies

```bash
yarn
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dvc_db?schema=public"
NODE_ENV=development
PORT=3000
JWT_EXPIRATION=1h
JWT_SECRET=random-secret
BIOMETRIC_SALT=biometric-random-salt
BIOMETRIC_SECRET=biometric-random-secret
```

> Adjust the `DATABASE_URL` to your local database setup (PostgreSQL recommended).

---

### 4. Prisma Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Run migrations (optional at start):

```bash
npx prisma migrate dev --name init
```

### 5. Start the Project

#### Development Mode (with hot-reloading)

```bash
yarn start:dev
```

#### Production Build

```bash
yarn build
yarn start:prod
```

---

### 6. Access GraphQL Playground on development environment

Once the server is running, navigate to:

```
http://localhost:3000/graphql
```
You’ll be able to run queries, mutations, and explore the schema.

## 🧪 Testing

```bash
yarn test
```