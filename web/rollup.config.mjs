/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'tvmjs',
    exports: 'named',
    globals: {'ws': 'ws',
              'perf_hooks': 'perf_hooks'}
  },
  plugins: [
    nodeResolve({ browser: true }),
    nodePolyfills({
      include: ['path', 'url']
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      rollupCommonJSResolveHack: false,
      clean: true,
    })
  ],
  external: ['ws', 'perf_hooks']
}

export default config;
