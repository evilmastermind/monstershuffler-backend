export const jwtHeaderRequired = {
  type: 'object',
  properties: {
    'authorization': { type: 'string'}
  },
  required: ['authorization']
};

export const jwtHeaderOptional = {
  type: 'object',
  properties: {
    'authorization': { type: 'string' }
  },
};