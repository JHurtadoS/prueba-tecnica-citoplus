<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

# Database Setup

## Supabase Tables

### **auth.users** (managed by Supabase)
- Stores user authentication details (e.g., email, password).

### **profiles**
- **id (UUID)**: Foreign key linked to `auth.users`.
- **name (string)**: User's name.
- **roles (array)**: List of roles (e.g., Admin, Editor, Viewer).
- **is_active (boolean)**: Indicates if the user is active.

### **audit_logs**
- **id (UUID)**: Primary key.
- **user_id (UUID)**: ID of the user performing the action.
- **target_id (UUID)**: ID of the affected profile.
- **action (text)**: Action performed (e.g., `create`, `update`).
- **details (JSONB)**: Additional details about the action.
- **created_at (timestamp)**: Timestamp of the action.

---

## Key Policies

### **Profiles Table**
- **Insert**: Only Admins can create profiles.
- **Select**: 
  - Users can only view their own profile.
  - Admins can view all profiles.
- **Update**: 
  - Users can update their own profile.
  - Admins can update any profile.
- **Delete**: Not directly implemented; use the `is_active` field for logical deletion.

### **Audit Logs**
- All changes to the `profiles` table trigger automatic entries in the `audit_logs` table via PostgreSQL triggers.

---

## Development Notes

### **Testing Authentication**
Use Postman or any API testing tool:
1. Generate a JWT token via `POST /auth/login` with your email and password.
2. Include the token in the `Authorization` header as `Bearer <token>` for protected routes.

### **Logging**
- Logs user actions for debugging and security.
- Ensure logs are stored correctly in the `audit_logs` table.

---

## Example Usage

### **Create a User**
**Endpoint**:  
`POST /users/create`

**Body**:
```json
{
  "email": "new_user@example.com",
  "password": "securePassword123",
  "name": "New User",
  "roles": ["Editor"]
}
```

### **Authenticate a User**
**Endpoint**:  
`POST /auth/login`

**Body**:
```json
{
  "email": "new_user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "accessToken": "<JWT_TOKEN>"
}
```

---

## Folder Structure

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   └── entities/
├── logs/
│   ├── logs.service.ts
│   └── logs.module.ts
├── supabase/
│   ├── supabase.service.ts
│   └── supabase.module.ts
```

---

## Testing

Run the following commands:

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npm run test:e2e
```

---

## License

This project is licensed under the [MIT License](LICENSE).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
