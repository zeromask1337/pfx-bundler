import z from "zod";

export const PEM_HEADER = {
  CERTIFICATE: "CERTIFICATE",
  PRIVATE_KEY: "PRIVATE KEY",
} as const;

export type PEMHeader= keyof typeof PEM_HEADER

export const pemSchema = (type: PEMHeader) =>
  z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value === "") return

      const lines = value.split(/\r?\n/);

      // Header check
      const headerMatch = lines[0]?.match(/^-----BEGIN ([A-Z\s]+)-----$/);
      if (!headerMatch) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid header format",
        });
        return;
      }

      if (!headerMatch[1].includes(type.toUpperCase())) {
        ctx.addIssue({
          code: "custom",
          message: `Header title should correspond to type ${type}`,
        });
        return;
      }

      const headerType = headerMatch[1];
      const expectedFooter = `-----END ${headerType}-----`;

      // Footer check
      if (lines[lines.length - 1] !== expectedFooter) {
        ctx.addIssue({
          code: "custom",
          message: "Header/footer mismatch",
        });
        return;
      }

      // Base64 content check
      const content = lines.slice(1, -1).join("");
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

      if (!base64Regex.test(content)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid base64 content",
        });
      }
});
