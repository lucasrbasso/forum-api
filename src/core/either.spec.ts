import { Either, left, right } from '@/core/either'

function shouldSuccess(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', () => {
  const result = shouldSuccess(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = shouldSuccess(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
