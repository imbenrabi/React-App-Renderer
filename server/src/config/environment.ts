import z from "zod";

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  isDev: boolean;
  apiUrl: string;
  clientPort: number;
}

export const envSchema = z.object({
  PORT: z.coerce.number().int().default(4001),
  NODE_ENV: z.string().default("development"),
  API_URL: z.string().default("https://api.example.com"),
  CLIENT_PORT: z.coerce.number().int().default(4000),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function getServerConfig(): ServerConfig {
  const env = envSchema.parse(process.env);
  const isDev = env.NODE_ENV === "development";

  return {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    isDev,
    apiUrl: env.API_URL,
    clientPort: env.CLIENT_PORT,
  };
}