export function Version(): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol | undefined, index: number) {
    // TBD
    // const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target);
    // paramTypes[index] = identifier;
    // Reflect.defineMetadata('design:paramtypes', paramTypes, target);
  };
}
