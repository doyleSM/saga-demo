import { v5 as uuidv5 } from 'uuid';
import stringify from 'json-stable-stringify';

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export function generateIdempotencyKey(payload: unknown) {
  if (!payload) {
    throw new Error('Payload não pode ser nulo ou indefinido');
  }
  const name = stringify(payload);

  if (!name) {
    throw new Error('Payload não pode ser vazio');
  }
  return uuidv5(name, NAMESPACE).toString();
}
