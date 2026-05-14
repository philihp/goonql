import React from 'react'

export const Type = ({ typeID, typeName, children }) => (
  <div>
    {children} <a href={`/types/${typeID}`}>{typeName}</a>
  </div>
)
