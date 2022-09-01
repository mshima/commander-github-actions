module.exports = {
  extends: ["plugin:prettier/recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["prettier", "@typescript-eslint"],
  ignorePatterns: ["dist/**"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: ["plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],

      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2022,
        project: "./tsconfig.json",
      },
      rules: {
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
};
