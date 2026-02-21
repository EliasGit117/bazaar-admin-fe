import { defineConfig } from '@hey-api/openapi-ts';


export default defineConfig({
  output: 'src/api/generated',
  input: 'http://localhost:3000/openapi.json',
  client: '@hey-api/client-ky',
  parser: {
    hooks: {
      operations: {
        isQuery: (op) => {
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
    {
      name: '@hey-api/typescript',
      enums: 'typescript'
    },
    {
      dates: true,
      name: '@hey-api/transformers'
    },
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
  if (!name)
    return 'default_unknown_unknown';

  // Extract HTTP method
  const method = VERBS.find((v) => name.startsWith(v));
  const withoutMethod = method ? name.slice(method.length) : name;

  // Extract PascalCase tokens
  const tokens = withoutMethod.match(/[A-Z][a-z0-9]*/g) ?? [];

  if (!tokens.length)
    return `default_${method ?? 'unknown'}_unknown`;

  // First token = resource
  const [resourceToken] = tokens;
  const resource = resourceToken!.toLowerCase();

  // Remaining tokens = operation
  const operationPascal = tokens.slice(1).join('');
  const operation = operationPascal.length > 0 ?
    operationPascal[0].toLowerCase() + operationPascal.slice(1) :
    'index';

  return `${resource}_${method ?? 'unknown'}_${operation}`;
}