import Link from 'next/link'
import type { ReactNode } from 'react'

type TypeProps = {
  typeID?: string | number | null
  typeName?: string | null
  children?: ReactNode
}

export const Type = ({ typeID, typeName, children }: TypeProps) => (
  <div>
    {children} <Link href={`/types/${typeID}`}>{typeName}</Link>
  </div>
)
