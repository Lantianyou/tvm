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
/* eslint-disable no-undef */
import { expect, test, vi } from 'vitest'
const path = require("path");
const fs = require("fs");
const assert = require("assert");
const tvmjs = require("../../dist/tvmjs.bundle")

const wasmPath = tvmjs.wasmPath();
const wasmSource = fs.readFileSync(path.join(wasmPath, "tvmjs_runtime.wasm"));

const tvm = new tvmjs.Instance(
  new WebAssembly.Module(wasmSource),
  tvmjs.createPolyfillWASI()
);

// Basic fields.
assert(tvm.listGlobalFuncNames() !== undefined);

// Test ndarray
function testArrayCopy(dtype, arrayType) {
  const data = [1, 2, 3, 4, 5, 6];
  const a = tvm.empty([2, 3], dtype).copyFrom(data);

  expect(a.dtype.toString()).toBe("cpu(0)");
  expect(a.shape).toEqual([2, 3]);
  const ret = a.toArray();
  expect(ret instanceof arrayType).toBe(true);
  expect(ret.toString()).toBe(arrayType.from(data).toString());
}

test("array copy", () => {
  tvm.withNewScope(() => {
    testArrayCopy("float32", Float32Array);
    testArrayCopy("int", Int32Array);
    testArrayCopy("int8", Int8Array);
    testArrayCopy("uint8", Uint8Array);
    testArrayCopy("float64", Float64Array);
  });
});
