# zod/mini v4 Reference

Tree-shakable Zod variant. Uses **wrapper functions** instead of methods.

```ts
import * as z from "zod/mini";
```

## Schema Instance Methods (ZodMiniType)

All schemas have these methods:

```ts
.parse(data)           // throws ZodError on failure
.safeParse(data)       // returns { success, data } | { success, error }
.parseAsync(data)      // async version
.safeParseAsync(data)  // async version
.check(...checks)      // add refinements/mutations
.register(registry, meta)
.brand<T>()
.clone(def)
.unwrap()              // extract inner schema (optional/nullable/array)
```

## Wrapper Functions (replace Zod methods)

```ts
// Modifiers
z.optional(schema)     // schema | undefined
z.nullable(schema)     // schema | null
z.nullish(schema)      // schema | null | undefined
z.array(schema)        // schema[]
z.readonly(schema)     // Readonly<schema>

// Objects
z.extend(objSchema, shape)
z.pick(objSchema, { key: true })
z.omit(objSchema, { key: true })
z.partial(objSchema)
z.partial(objSchema, { key: true })
z.required(objSchema)
z.required(objSchema, { key: true })
z.keyof(objSchema)

// Enums
z.exclude(enumSchema, [...values])
z.extract(enumSchema, [...values])

// Unions/Intersections
z.union([schemaA, schemaB])
z.discriminatedUnion("key", [objA, objB])
z.intersection(schemaA, schemaB)
z.xor([schemaA, schemaB])

// Composition
z.pipe(schemaA, schemaB)
z.transform(fn)
z.preprocess(fn, schema)

// Objects (additional)
z.catchall(objSchema, schema)

// Other
z.default(schema, value)
z.default(schema, () => value)
z.prefault(schema, value)
z.catch(schema, fallback)
z.lazy(() => schema)
```

## Check Functions (use with .check())

```ts
// Numbers/BigInts
z.lt(value)
z.lte(value)           // alias: z.maximum()
z.gt(value)
z.gte(value)           // alias: z.minimum()
z.positive()
z.negative()
z.nonpositive()
z.nonnegative()
z.multipleOf(value)

// Strings/Arrays/Sets
z.minLength(n)
z.maxLength(n)
z.length(n)

// Strings only
z.regex(pattern)
z.lowercase()
z.uppercase()
z.includes(str)
z.startsWith(str)
z.endsWith(str)

// Sets/Maps/Arrays
z.minSize(n)
z.maxSize(n)
z.size(n)

// Files
z.mime(type)           // single or array

// Objects/Classes
z.property(key, schema)

// Custom
z.refine(fn, opts?)
z.check(fn)            // replaces .superRefine()

// Mutations (don't change types)
z.overwrite(fn)
z.normalize()
z.trim()
z.toLowerCase()
z.toUpperCase()
```

## Schema Constructors (same as Zod)

### Primitives
```ts
z.string()
z.number()
z.bigint()
z.boolean()
z.symbol()
z.undefined()
z.null()
z.void()
z.any()
z.unknown()
z.never()
z.nan()
```

### Coercion
```ts
z.coerce.string()
z.coerce.number()
z.coerce.boolean()
z.coerce.bigint()
```

### Numbers
```ts
z.int()
z.int32()
```

### String Formats
```ts
z.email(opts?)
z.uuid(opts?)
z.uuidv4() / z.uuidv6() / z.uuidv7()
z.guid()
z.url(opts?)
z.httpUrl()
z.hostname()
z.emoji()
z.base64()
z.base64url()
z.hex()
z.jwt(opts?)
z.nanoid()
z.cuid()
z.cuid2()
z.ulid()
z.ipv4()
z.ipv6()
z.mac(opts?)
z.cidrv4()
z.cidrv6()
z.hash(algo, opts?)    // "md5"|"sha1"|"sha256"|"sha384"|"sha512"
z.iso.date()
z.iso.time(opts?)
z.iso.datetime(opts?)
z.iso.duration()
z.stringFormat(name, validatorFn)
z.templateLiteral([...parts])
```

### Composites
```ts
z.literal(value)
z.literal([...values])
z.enum([...values])
z.enum(enumObj)
z.stringbool(opts?)
z.object(shape)
z.strictObject(shape)
z.looseObject(shape)
z.array(schema)
z.tuple([...schemas], rest?)
z.set(schema)
z.map(keySchema, valueSchema)
z.record(keySchema, valueSchema)
z.partialRecord(keySchema, valueSchema)
z.looseRecord(keySchema, valueSchema)
z.date()
z.file()
z.instanceof(Class)
z.json()
z.custom<T>(validator?, opts?)
z.function({ input, output })
z.codec(inputSchema, outputSchema, { decode, encode })
```

## Utilities

```ts
z.infer<typeof schema>      // output type
z.input<typeof schema>      // input type
z.output<typeof schema>     // output type (alias)
z.NEVER                     // never constant for transforms
z.config(locale)            // set locale
z.locales.en()              // English locale (not loaded by default!)
z.registry<Meta>()          // create metadata registry
z.decode(codec, value)      // forward transform
z.encode(codec, value)      // reverse transform
z.treeifyError(error)       // format errors
z.regexes.email             // default email regex
z.regexes.html5Email        // browser email regex
z.regexes.rfc5322Email      // RFC 5322 regex
z.regexes.unicodeEmail      // intl email regex
z.regexes.domain            // domain regex
```

## Object Schema Properties

```ts
objSchema.shape              // { key: schema }
objSchema.keyof()            // ZodEnum of keys
```

## Enum Schema Properties

```ts
enumSchema.enum              // { key: value } object
enumSchema.options           // [schema, schema, ...]
```

## Literal Schema Properties

```ts
literalSchema.values         // Set of allowed values
```

## Key Differences from Zod

| Zod                          | zod/mini                           |
|------------------------------|------------------------------------|
| `schema.optional()`          | `z.optional(schema)`               |
| `schema.nullable()`          | `z.nullable(schema)`               |
| `schema.array()`             | `z.array(schema)`                  |
| `z.string().min(5).max(10)`  | `z.string().check(z.minLength(5), z.maxLength(10))` |
| `obj.extend({...})`          | `z.extend(obj, {...})`             |
| `obj.pick({k: true})`        | `z.pick(obj, {k: true})`           |
| `obj.omit({k: true})`        | `z.omit(obj, {k: true})`           |
| `obj.partial()`              | `z.partial(obj)`                   |
| `schema.transform(fn)`       | `z.pipe(schema, z.transform(fn))` or `schema.pipe(z.transform(fn))` |
| `schema.default(v)`          | `z.default(schema, v)`             |
| English locale auto-loaded   | Must call `z.config(z.locales.en())` |

## Example

```ts
import * as z from "zod/mini";

z.config(z.locales.en());

const User = z.object({
  id: z.uuid(),
  email: z.email(),
  age: z.optional(z.number().check(z.gte(0), z.lte(150))),
  role: z.enum(["admin", "user"]),
});

const CreateUser = z.omit(User, { id: true });
const PartialUser = z.partial(User);

type User = z.infer<typeof User>;
```