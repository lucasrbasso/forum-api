import { Request, Response, NextFunction } from 'express'
import { Injectable, NestMiddleware, Logger } from '@nestjs/common'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request
    const userAgent = request.get('user-agent') || ''

    response.on('finish', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length')

      if (![200, 201, 204].includes(statusCode)) {
        this.logger.error(
          `method=${method} url=${originalUrl} response_code=${statusCode} content_length=${contentLength} - user_agent=${userAgent} ip=${ip}`,
        )
      }
    })

    next()
  }
}
