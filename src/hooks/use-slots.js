// This code is used to extract the contents of a component's children and return them as an array.
// The code accepts two arguments, the names of the components that it should extract, and the children to extract from.
// The code returns an array of the children of the components passed in the types argument.
// based on:
// https://medium.com/swlh/bring-vue-named-slots-to-react-87684188f18e

import { useMemo } from 'react'

export function useSlots(types = [], children = []) {
  const _children = useMemo(() => children && [children].flat(), [children])
  const _types = useMemo(() => types && [types].flat(), [types])
  const slots = useMemo(() => {
    if (!_children || !_types) {
      return
    }

    const slots = _types.map((type) => _children.find((el) => el.type === type)?.props.children)

    return types[0] ? slots : slots[0]
  }, [_children, _types])

  return slots
}
