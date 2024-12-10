import { z } from 'zod';

export const jwtHeaderRequired = z.object({
  authorization: z.string()
});

export const jwtHeaderOptional = z.object({
  authorization: z.string().optional()
});

// export const jwtHeaderRequired = {
//   type: 'object',
//   properties: {
//     authorization: { type: 'string' },
//   },
//   required: ['authorization'],
// };

// export const jwtHeaderOptional = {
//   type: 'object',
//   properties: {
//     authorization: { type: 'string' },
//   },
// };

export const  BatchPayload = z.object({
  count: z.number()
});

// export const BatchPayload = {
//   type: 'object',
//   properties: {
//     count: { type: 'number' },
//   },
// };

export type AnyObject = {
  [key: string]: any;
};
