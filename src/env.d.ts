declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    JWT_SECRET: string;
    MONGO_URL: string;
  }
}
