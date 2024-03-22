import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }

  async hash(plain: string) {
    return plain.concat('-hashed')
  }
}
