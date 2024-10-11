import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  MONGO_DB_NAME: string;
  MONGO_DB_URL: string;
  MONGO_USER: string;
  MONGO_PASS: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_DB_NAME: joi.string().required(),
    MONGO_DB_URL: joi.string().uri().required(),
    MONGO_USER: joi.string().required(),
    MONGO_PASS: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true);

console.log('Variables de Entorno Disponibles:', {
  PORT: process.env.PORT,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASS: process.env.MONGO_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
});

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation Error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mongoDbName: envVars.MONGO_DB_NAME,
  mongoDbUrl: envVars.MONGO_DB_URL,
  mongoUser: envVars.MONGO_USER,
  mongoPass: envVars.MONGO_PASS,
  jwtSecret: envVars.JWT_SECRET,
};
