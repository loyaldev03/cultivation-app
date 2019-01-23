module.exports = {
    "env": {
        "browser": true,
        "es6": true,
    },
    "extends": [
        "eslint:recommended",
    ],
    "settings": {
        "react": {
          "pragma": "React",
          "version": "16.6.3",
        },
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
    ],
    "rules": {
        "react/prop-types": 0,
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
            "never"
        ],
        "no-unused-vars": [
            "error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": true }
        ],
    }
};
