import { ZodError, ZodType } from "zod";
import type { ValidationTargets } from "hono";
import { validator as zv } from "hono-openapi";
import { ApiException } from "@/exceptions";
import { fromError } from "zod-validation-error";

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      const validationError = fromError(new ZodError(result.error as any));
      throw new ApiException({
        status: 400,
        message: validationError.message,
      });
    }
  });
