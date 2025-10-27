import { ZodType } from "zod";
import type { ValidationTargets } from "hono";
import { validator as zv } from "hono-openapi/zod";
import { ApiException } from "@/exceptions";

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      throw new ApiException({
        status: 400,
        message: result.error.message,
      });
    }
  });
