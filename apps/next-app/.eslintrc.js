/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  // For next-intl
  // rules: {
  //   // Consistently import navigation APIs from `@/navigation`
  //   "no-restricted-imports": [
  //     "error",
  //     {
  //       name: "next/link",
  //       message: "Please import from `@/lib/navigation` instead.",
  //     },
  //     {
  //       name: "next/navigation",
  //       importNames: [
  //         "redirect",
  //         "permanentRedirect",
  //         "useRouter",
  //         "usePathname",
  //       ],
  //       message: "Please import from `@/lib/navigation` instead.",
  //     },
  //   ],
  // },
};
