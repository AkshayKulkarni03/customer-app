module.exports = {
    preset: 'jest-preset-angular',
    globals: {
        'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' },
    },
    snapshotSerializers: [
        "jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js",
        "jest-preset-angular/build/AngularSnapshotSerializer.js",
        "jest-preset-angular/build/HTMLCommentSerializer.js"
    ],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^app/(.*)$': '<rootDir>/src/app/$1',
        '^assets/(.*)$': '<rootDir>/src/assets/$1',
        "\\.(jpg|jpeg|png)$": "<rootDir>/__mocks__/image.js",
        "^@lib/(.*)$": "<rootDir>/src/lib/$1",
        "^@environments/(.*)$": "<rootDir>/src/environments/$1"
    },
    testMatch: ["**/src/**/*.spec.ts"],
    setupFilesAfterEnv: [
        "<rootDir>/src/setupJest.ts"
    ],
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!coverage/**",
        "!node_modules/**",
        "!src/index.js",
        "!src/setupTests.js",
        "!public/**",
        "!build/**",
        "!dist/**",
        "!mocks/**",
        "!e2e/**"
    ],
    coverageReporters: [
        "text", "lcov", "json", "text", "clover", "cobertura"
    ]
}