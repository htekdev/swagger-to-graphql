import { GraphQLObjectType } from 'graphql';

export interface RootGraphQLSchema {
  query: GraphQLObjectType;
  mutation?: GraphQLObjectType;
}

interface CommonSchema {
  description?: string;
  title?: string;
}

export interface BodySchema extends CommonSchema {
  in: 'body';
  schema: JSONSchemaType;
  required?: boolean;
}

export interface EnumSchema extends CommonSchema {
  enum: string[];
  required?: boolean;
}
export interface ObjectSchema extends CommonSchema {
  type: 'object';
  properties: {
    [propertyName: string]: JSONSchemaType;
  };
  required?: string[];
}

export interface ArraySchema extends CommonSchema {
  type: 'array';
  items: JSONSchemaNoBody | JSONSchemaNoBody[];
  required?: boolean;
}

export type JSONSchemaTypes =
  | 'string'
  | 'date'
  | 'integer'
  | 'number'
  | 'boolean'
  | 'file';

export interface ScalarSchema extends CommonSchema {
  type: JSONSchemaTypes;
  format?: string;
  required?: boolean;
}

export type JSONSchemaNoBody = ObjectSchema | ArraySchema | ScalarSchema
export type JSONSchemaType = BodySchema | JSONSchemaNoBody | EnumSchema;

export const isBodyType = (
  jsonSchema: JSONSchemaType,
): jsonSchema is BodySchema =>
  Object.keys(jsonSchema).includes('in') &&
  (jsonSchema as BodySchema).in === 'body';

export const isEnumType = (
  jsonSchema: JSONSchemaType,
): jsonSchema is EnumSchema =>
  !isBodyType(jsonSchema) &&
  Object.keys(jsonSchema).includes('enum');
  
export const isObjectType = (
  jsonSchema: JSONSchemaType,
): jsonSchema is ObjectSchema =>
  !isBodyType(jsonSchema) &&
  !isEnumType(jsonSchema) &&
  (Object.keys(jsonSchema).includes('properties') ||
  jsonSchema.type === 'object');

export const isArrayType = (
  jsonSchema: JSONSchemaType,
): jsonSchema is ArraySchema =>
  !isBodyType(jsonSchema) &&
  !isEnumType(jsonSchema) &&
  jsonSchema.type === 'array';
