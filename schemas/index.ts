export const jwtHeaderRequired = {
  type: "object",
  properties: {
    authorization: { type: "string" },
  },
  required: ["authorization"],
};

export const jwtHeaderOptional = {
  type: "object",
  properties: {
    authorization: { type: "string" },
  },
};

export const BatchPayload = {
  type: "object",
  properties: {
    count: { type: "number" },
  },
};

export type AnyObject = {
  [key: string]: any;
};
