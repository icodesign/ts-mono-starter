import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiException extends HTTPException {
  code: string | undefined;

  constructor({
    status,
    code,
    message,
    cause,
  }: {
    status?: ContentfulStatusCode;
    code?: string;
    message?: string;
    cause?: unknown;
  }) {
    super(status, { message, cause });
    this.code = code;
  }

  getResponse(): Response {
    const body = {
      code: this.code,
      message: this.message || "Internal Server Error",
    };
    return new Response(JSON.stringify(body), {
      status: this.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export class ServerException extends ApiException {
  constructor({ code, message, cause }: { code?: string; message: string; cause?: unknown }) {
    super({
      status: 500,
      message,
      code,
      cause,
    }); 
  }
}

export class UnauthorizedException extends ApiException {
  constructor({ code, message, cause }: { code?: string; message: string; cause?: unknown }) {
    super({
      status: 401,
      message,
      code,
      cause,
    }); 
  }
}