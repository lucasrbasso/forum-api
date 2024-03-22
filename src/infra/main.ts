/* eslint-disable import/first */
import { otelSDK } from './telemetry/tracing'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import helmet from 'helmet'

import * as core from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { EnvService } from '@/infra/env/env.service'

async function bootstrap() {
  await Promise.resolve(otelSDK.start()).then(() =>
    console.log('Opentelemetry started'),
  )

  const app = await core.NestFactory.create(AppModule)

  app.useLogger(app.get(Logger))
  app.use(helmet())
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  const config = new DocumentBuilder()
    .setTitle('Forum api')
    .setDescription('The forum API endpoints')
    .setVersion('1.1')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port)
}

bootstrap()
