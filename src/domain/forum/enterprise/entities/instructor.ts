import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface InstructorProps {
  name: string
  createdAt: Date
}
export class Instructor extends Entity<InstructorProps> {
  static create(
    props: Optional<InstructorProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const instructor = new Instructor(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return instructor
  }
}
