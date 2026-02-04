query-engine.ts
===============

Intended usage:

```ts


// model/user.ts

import { Document, ID, Version, String, Index, CompositeIndex } from '@finwo/query-engine/decorators';

@Document({ adapter?: customAdapterInstance })
@CompositeIndex('otherIndexName', {
    fields: ['fieldA', 'fieldB']
    order?: 'ascending',
    unique?: true/false,
})
export class User {

  @Version()
  static _version = 0;

  static _migrate(record: Record<??>): User {
    // Code to update old version to current
  }

  // TODO: define proper annotations
  @ID()
  _id: string;

  @String()
  @Index('indexName'[, { order?: 'ascending', unique?: true/false }])
  username: string;

  ...
}

// main.ts
import QueryEngine from '@finwo/query-engine';

import { LevelAdapter } from '@finwo/query-engine';

import { User } from 'model/user.ts';

const queryEngine = new QueryEngine({
    defaultAdapter: new LevelAdapter({
        datadir: __dirname + '/data/'
    }),
    documents: {
        documentTypeName: {
            model: User,
        }
    },
});

// Runtime addition:
queryEngine.defineTable(...)
queryEngine.registerAdapter('name', adapterInstance)

const data = await queryEngine

    // Start query builder
    .query('documentTypeName')

    // Initial result set
    .useIndex('indexName', {
        strategy: 'merge-strategy TBD: outer (keep both), inner (keep overlap), union, etc....',
        filter: {
            fieldName: {
                operator: 'lte, gte, ...',
                value: 'some-value',
            }
        }
    })

    // Future feature
    // Define symbol to search without running through user-code
    .defineSymbol('symbolName', 'fieldName')

    // Filter down further
    .useIndex('otherIndex', {
        strategy: 'inner',
        filter: {
            otherField: {
                operator: 'in',
                symbol: 'symbolName',
            }
        }
    })

    // TODO: how to do joins and merges with other document types?

    // And start the query, returns promise to the data
    .values();

// Inserting documents
await queryEngine
    .insert('documentTypeName', entity instanceof User?, {
        upsert: false, // Throw error if already exists, default
        upsert: true, // Quietly overwrite if already exists
    })
    .insert('documentTypeName', ...)

// Updating single document
await queryEngine
    .update('documentTypeName', 'documentId', {
        ..newData
    });

// Updating multiple documents, fixed value
await queryEngine
    .query('documentTypeName')
    .useIndex(...)
    .update({
        ...newData
    });

// Updating multiple documents, dynamic value
await queryEngine
    .query('documentTypeName')
    .useIndex(...)
    .update(document => {
        // Do some actions here
        document.profit = document.income - document.costs;
        return document; // <-- something else maybe?
    });

// Deleting documents by _id
await queryEngine
    .delete('documentTypeName', 'documentId');

// Deleting documents by query
await queryEngine
    .query('documentTypeName')
    .useIndex(...)
    .delete()

```

On-disk/storage, per table, we get something like:

```

/cfg
    {
        indexes: {
            _id: {
                fields: ['_id'],
                order: 'ascending',
                unique: true,
            },
            indexName: {
                fields: ['username'],
                order: 'ascending',
                unique: true,
            },
        }
        // more to be defined
    }

/idx/<indexName>/<hex-encoded-value>
    <documentId>
    <documentId>
    ...

/obj/<hex-encoded-object-id>
    {
        _id: <uuid>,
        _version: 123,
        username: 'alice'
    },

```
