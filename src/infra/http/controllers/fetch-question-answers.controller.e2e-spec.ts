import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachments'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let answerCommentFactory: AnswerCommentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerCommentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const firstAttachment = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    })

    const secondAttachment = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    })

    const firstAnswer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
      content: 'Answer 01',
    })

    const secondAnswer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
      content: 'Answer 02',
    })

    await Promise.all([
      answerCommentFactory.makePrismaAnswerComment({
        answerId: firstAnswer.id,
        authorId: user.id,
        content: 'Some comment',
      }),
      answerCommentFactory.makePrismaAnswerComment({
        answerId: secondAnswer.id,
        authorId: user.id,
        content: 'Some comment',
      }),
      answerAttachmentFactory.makePrismaAnswerAttachment({
        attachmentId: firstAttachment.id,
        answerId: firstAnswer.id,
      }),
      answerAttachmentFactory.makePrismaAnswerAttachment({
        attachmentId: secondAttachment.id,
        answerId: secondAnswer.id,
      }),
    ])

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({
          content: 'Answer 01',
          author: 'John Doe',
          comments: expect.arrayContaining([
            expect.objectContaining({
              content: 'Some comment',
              authorName: 'John Doe',
            }),
          ]),
          attachments: [
            expect.objectContaining({
              title: 'Some attachment',
            }),
          ],
        }),
        expect.objectContaining({
          content: 'Answer 02',
          author: 'John Doe',
          comments: expect.arrayContaining([
            expect.objectContaining({
              content: 'Some comment',
              authorName: 'John Doe',
            }),
          ]),
          attachments: [
            expect.objectContaining({
              title: 'Some attachment',
            }),
          ],
        }),
      ]),
    })
  })
})
