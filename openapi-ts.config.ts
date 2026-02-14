import { defineConfig } from '@hey-api/openapi-ts';


export default defineConfig({
  output: 'src/api/generated',
  input: 'http://localhost:3000/openapi.json',
  client: '@hey-api/client-ky',
  parser: {
    hooks: {
      operations: {
        isQuery: (op) => {
          console.log(op);
          if (op.method === 'get')
            return true;

          if (op.method !== 'post')
            return false;

          const keys = ['list', 'search'];

          if (
            keys.some(word => op.path?.toLowerCase().includes(word)) ||
            keys.some(word => op.operationId?.toLowerCase().includes(word))
          )
            return true;

          return false;
        }
      }
    }
  },
  plugins: [
    { name: '@hey-api/client-ky' },
    { enums: 'typescript', name: '@hey-api/typescript', },
    {
      name: '@hey-api/sdk',
      operations: {
        strategy: 'single',
        containerName: 'Client',
        nesting(operation) {
          return [pickGroup(operation), pickMethod(operation)];
        }
      }
    },
    {
      name: '@tanstack/react-query',
      case: 'preserve',
      mutationOptions: { name: (n: string) => `${controllerEndpoint(n)}_MutationOptions` },
      queryOptions: { name: (n: string) => `${controllerEndpoint(n)}_QueryOptions` },
      queryKeys: { name: (n: string) => `${controllerEndpoint(n)}_QueryKeys` },
      infiniteQueryOptions: { name: (n: string) => `${controllerEndpoint(n)}_InfiniteQueryOptions` },
      infiniteQueryKeys: { name: (n: string) => `${controllerEndpoint(n)}_InfiniteQueryKeys` }
    }
  ]
});

function toCamel(input: string) {
  return input
    .replace(/[_\s-]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

function pickGroup(op: any) {
  // Prefer the first tag; fallback to "default"
  const tag = op.tags?.[0] ?? 'default';
  return toCamel(tag);
}

function pickMethod(op: any) {
  // Operation ids look like "AuthController_signIn"
  // This will produce "signIn", "signOut", "getAll", etc.
  const id: string = op.operationId ?? '';
  const tail = id.includes('_') ? id.split('_').pop()! : id;
  return toCamel(tail);
}

const VERBS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'] as const;

export function controllerEndpoint(name: string) {
  if (!name) return 'default_default';

  const verb = VERBS.find((v) => name.startsWith(v));
  const withoutVerb = verb ? name.slice(verb.length) : name;

  const tokens = withoutVerb.match(/[A-Z][a-z0-9]*/g) ?? [withoutVerb];
  const controller = (tokens[0] ?? 'default').toLowerCase();

  if (tokens.length === 1) {
    return `${controller}_index`;
  }

  const endpointPascal = tokens.slice(1).join('');
  const endpoint = endpointPascal[0].toLowerCase() + endpointPascal.slice(1);

  return `${controller}_${endpoint}`;
}