module.exports = {
    testEnvironment: 'jsdom',

    transform: {
        '^.+\\.tsx?$': 'babel-jest'
    },

    moduleNameMapper: {
        '^@api$': '<rootDir>/src/utils/burger-api.ts',
        '^@utils-types$': '<rootDir>/src/utils/types',
        '^@pages$': '<rootDir>/src/pages',
        '^@components$': '<rootDir>/src/components',
        '^@ui$': '<rootDir>/src/components/ui',
        '^@ui-pages$': '<rootDir>/src/components/ui/pages',
        '^@slices$': '<rootDir>/src/services/slices',
        '^@selectors$': '<rootDir>/src/services/selectors',
        '^@thunks$': '<rootDir>/src/services/thunks'
    }
};