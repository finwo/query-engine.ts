import {AbstractAdapter} from "./adapter/abstract";
import {Constructable} from "./types/constructable";

export type DocumentDefinition = {
  model: Constructable<{}>
}

export class Query<P extends Constructable<{}>> {
  constructor(protected documentType: P) {
    // TBD
  }
}

export class QueryEngine<DocumentDefinitions extends Record<string, DocumentDefinition>> {
  protected documents: DocumentDefinitions;

  constructor(options: {
    defaultAdapter?: AbstractAdapter,
    documents?: DocumentDefinitions,
  } = {

  }) {
    // Sanitize inputs
    if ('object' !== typeof options) options = {};
    options = Object.assign({ documents: {} }, options || {});
    if ('object' !== typeof options.documents) options.documents = {} as DocumentDefinitions;
    options.documents = Object.assign({}, options.documents || {} as DocumentDefinitions);

    // clean enough
    this.documents = options.documents;
  }

  query<M extends keyof DocumentDefinitions>(documentType: M): Query<DocumentDefinitions[M]['model']> {
    return new Query(this.documents[documentType].model);
  }

}


