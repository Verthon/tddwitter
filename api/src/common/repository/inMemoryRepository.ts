import type { Repository } from "./Repository.js"

type InMemoryRepositoryOptions<Entity, Id> = {
  getId: (entity: Entity) => Id
}

export const createInMemoryRepository = <Entity, Id>(
  options: InMemoryRepositoryOptions<Entity, Id>
): Repository<Entity, Id> => {
  const storage = new Map<Id, Entity>()

  return {
    getById: async (id) => {
      const record = storage.get(id)
      if (!record) {
        throw new Error('Record not found')
      }
      return record
    },
    existsById: async (id) => storage.has(id),
    findById: async (id) => storage.get(id) ?? null,
    save: async (entity) => {
      storage.set(options.getId(entity), entity)
    },
    findAll: async () => Array.from(storage.values())
  }
}
