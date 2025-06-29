import {defineConfig} from 'vitest/config'


console.log('Vitest configuration loaded! 12345');


export default defineConfig({
    test: {
        setupFiles: ['./test/setup.ts'], //$ Path to your setup file
        globals: true, //$ enables global test methods as describe, it, expect, etc., without needing to import them explicitly in every test file.
        fileParallelism: false, //$ Avoids random test order across different test files.

        sequence:{
            concurrent: false, 	//$ Concurrency within a SINGLE test file
            shuffle: false //$ Avoids random test order within a file
        },

        // include: ['tests/socket-io-three.test.ts', 'tests/api.test.ts'],
    },

})