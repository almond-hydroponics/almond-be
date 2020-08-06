module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends:  [
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    project: './tsconfig.json',
  },
  rules:  {
    "prettier/prettier": [0,
      {
        "semi": true,
        "singleQuote": true,
        "trailingComma": "es5",
        "printWidth": 100,
        "tabWidth": 2,
        "arrowParens": "avoid",
        "jsxSingleQuote": false,
        "jsxBracketSameLine": true,
      }
    ],

    "semi": 0,
    "eqeqeq": [1, "always"],
    "quotes": [1, "single"],
    "jsx-quotes": [2, "prefer-double"],
    "no-undef": 0,
    "no-console": 2,
    "no-unused-vars": 0,
    "no-mixed-operators": [1,
      {
        "allowSamePrecedence": true
      }
    ],
    "eol-last": [2, "always"],
    "no-confusing-arrow": 0,
    "arrow-parens": [2, "as-needed"],
    "arrow-spacing": ["error", {"before": true, "after": true}],
    "arrow-body-style": [2, "as-needed"],
    "no-extra-parens": [
      "warn",
      "all",
      {
        "conditionalAssign": false,
        "nestedBinaryExpressions": false,
        "ignoreJSX": "none",
        "enforceForArrowConditionals": false
      }
    ],

    "import/prefer-default-export": 0,
    "import/no-useless-path-segments": 1,
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-named-as-default": 0,
    "import/no-duplicates": 0,
    "import/order": 0,
    "import/newline-after-import": 1,
    "import/no-named-as-default-member": 0,
    "import/namespace": 0,
    "import/named": 0,

    "@typescript-eslint/indent": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/member-delimiter-style": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/no-angle-bracket-type-assertion": 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/interface-name-prefix': 0,
  },
};
