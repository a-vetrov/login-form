module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        },
        {
            "files": ['**/*.js'],
            "extends": ['plugin:@typescript-eslint/disable-type-checked']
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "parser": "@typescript-eslint/parser",
        "project": "./tsconfig.json",
        "tsconfigRootDir": __dirname,
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": [
            "warn",
            {
                "allowString": true,
                "allowNumber": false,
                "allowNullableObject": true,
                "allowNullableBoolean": true,
                "allowNullableNumber": false,
                "allowNullableString": true,
                "allowAny": false
            }
        ]
    }
}
