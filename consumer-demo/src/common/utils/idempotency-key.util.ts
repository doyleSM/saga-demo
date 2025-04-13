import { v5 as uuidv5 } from 'uuid';
import stringify from 'json-stable-stringify';

// Escolha um namespace fixo (UUID válido). NÃO mude depois!
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export function generateIdempotencyKey(payload: unknown) {
  if (!payload) {
    throw new Error('Payload não pode ser nulo ou indefinido');
  }
  // serializa de forma estável
  const name = stringify(payload);

  if (!name) {
    throw new Error('Payload não pode ser vazio');
  }
  // gera UUIDv5
  return uuidv5(name, NAMESPACE).toString();
}
