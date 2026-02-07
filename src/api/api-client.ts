import { type Config } from '@/api/generated/client';
import { Client } from '@/api/generated';
import { client } from '@/api/generated/client.gen.ts';
import { envConfig } from '@/lib/utils';


const config: Config = {
  baseUrl: envConfig.apiUrl ?? 'http://localhost:3000',
  credentials: 'include',
};

client.setConfig(config);

export const apiClient = new Client();
