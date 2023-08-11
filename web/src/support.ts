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

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


/**
 * Convert string to Uint8array.
 * @param str The string.
 * @returns The corresponding Uint8Array.
 * ref: https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
 */
export function StringToUint8Array(str: string) {
  return new TextEncoder().encode(str);
}

/**
 * Convert Uint8array to string.
 * @param array The array.
 * @returns The corresponding string.
 * ref: https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
 */
export function Uint8ArrayToString(arr: Uint8Array) {
  return new TextDecoder("utf-8").decode(arr);
}

/**
 * Internal assert helper
 * @param condition condition The condition to fail.
 * @param msg msg The message.
 */
export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) {
    throw new Error("AssertError:" + (msg || ""));
  }
}

/**
 * Get the path to the wasm library in nodejs.
 * @return The wasm path.
 */
export function wasmPath() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, "wasm");
}
