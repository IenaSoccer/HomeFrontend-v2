type UUID = string & { __brand: "uuid" }

function asUUID(value: string): UUID {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error("Invalid UUID")
  }
  return value as UUID
}

export type { UUID };
export { asUUID };