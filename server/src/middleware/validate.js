// Generic Zod validation middleware. Pass a schema and it validates
// req.body, attaching the parsed (and type-coerced) result back onto
// req.body so controllers can trust the shape of the data.
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        error: message || "Invalid request body",
      });
    }

    req.body = result.data;
    next();
  };
}
