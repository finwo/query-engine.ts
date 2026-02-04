export function CompositeIndex(): ClassDecorator {
  return targetConstructor => {
    // map.set(targetConstructor, {
    //   type  : targetConstructor,
    //   fn    : targetConstructor,
    //   value : EMPTY_VALUE,
    // });
  };
}
