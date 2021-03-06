import { convert } from './originalAvro';
import { JSONSchema7 } from 'json-schema';
import { AvroSchemaDefinition } from '../avro';

function convertToAvro(schema: JSONSchema7): AvroSchemaDefinition {
  return convert(schema);
}

export default convertToAvro;
