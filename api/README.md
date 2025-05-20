<p align="center">
  <a href="https://github.com/Singularity-development/finarbo" target="blank"><img src="https://i.imgur.com/EjvMv8S.png" width="120" alt="Fiarnbo Logo" /></a>
</p>

# Finarbo API – NestJS Framework

This repository contains the Finarbo API built using the [NestJS](https://nestjs.com/) framework with TypeScript.

## 🛠️ Project Setup

### 📦 Install Dependencies

```bash
$ npm install
```

### ⚙️ Configure Environment Variables

1. Copy the `.env.example` file from the [api](../api/) folder.
2. Rename it to `.env`.
3. Fill in all **required** variables.

## 🚀 Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🐳 Docker

### [PostgreSQL](https://www.postgresql.org/) Database Setup

If you prefer using Docker for the database:

1. Copy the `.env.example` file from the [docker](./docker) folder.
2. Fill in all required variables.
3. Start the PostgreSQL container:

```bash
docker-compose -f docker/postgresql.yml up -d
```
