export type FindAllCursorBased<Entity, CursorParams> = {
  findAllCursorBased(params: CursorParams): Promise<Entity[]>;
};

export type Save<Entity> = {
  save(entity: Entity): Promise<void>;
};

export type FindById<Entity, Id> = {
  findById(id: Id): Promise<Entity | null>;
};

export type RepositoryType = "sql" | "inMemory";
