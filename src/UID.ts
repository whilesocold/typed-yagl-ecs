const MAX_SALTS = 10000
const MAX_ENTITY_PER_GENERATOR = Math.floor(Number.MAX_VALUE / MAX_SALTS) - 1

let currentSalt = 0

class UIDGenerator {
  private uidCounter: number
  private salt: number

  constructor(salt: number = 0) {
    this.salt = salt
    this.uidCounter = 0
  }

  next(): number {
    let nextUid = this.salt + this.uidCounter * MAX_SALTS

    if (++this.uidCounter >= MAX_ENTITY_PER_GENERATOR) {
      this.uidCounter = 0
    }

    return nextUid
  }
}

const DefaultUIDGenerator = new UIDGenerator(currentSalt++)

const isSaltedBy = (entityId: number, salt: number): boolean => {
  return entityId % MAX_SALTS === salt
}

const nextSalt = (): number => {
  let salt = currentSalt

  if (++currentSalt > MAX_SALTS - 1) {
    currentSalt = 1
  }

  return salt
}

const nextGenerator = (): UIDGenerator => {
  return new UIDGenerator(nextSalt())
}

export {
  UIDGenerator,
  DefaultUIDGenerator,
  isSaltedBy,
  nextGenerator,
}

