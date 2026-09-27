// Generic Zod validation middleware
export function validateBody(schema) {
  return (req, res, next) => {
    console.log("1. Original request body:", req.body);

    const result = schema.safeParse(req.body);

    console.log("2. Zod validation result:", result);

    if (!result.success) {
      console.log("3. Validation failed!");

      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      console.log("4. Error messages:", message);

      return res.status(400).json({
        success: false,
        error: message || "Invalid request body",
      });
    }

    console.log("3. Validation successful!");
    console.log("4. Parsed data:", result.data);

    req.body = result.data;

    console.log("5. Updated request body:", req.body);
    console.log("6. Calling next()...");

    next();
  };
}