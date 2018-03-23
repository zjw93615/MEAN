module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:angular/johnpapa"],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        'no-console': "off",
        "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        "angular/file-name": 0,
        "angular/controller-name": 0,
        "no-undef": 0
    },
    "parserOptions": {
        "ecmaVersion": 6
    }
};