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
import { expect } from "vitest";
import { tvmTest } from "./tvmTest";
import { randomArray } from "./utils";

tvmTest("add one", ({tvm}) => {
  tvm.beginScope();
  // Load system library
  const sysLib = tvm.systemLib();
  // grab pre-loaded function
  const faddOne = sysLib.getFunction("add_one");
  tvm.detachFromCurrentScope(faddOne);

  expect(tvm.isPackedFunc(faddOne)).toBe(true);
  const n = 124;
  const A = tvm.empty(n).copyFrom(randomArray(n, 1));
  const B = tvm.empty(n);
  // call the function.
  faddOne(A, B);
  const AA = A.toArray(); // retrieve values in js array
  const BB = B.toArray(); // retrieve values in js array
  // verify
  for (var i = 0; i < BB.length; ++i) {
    expect(Math.abs(BB[i] - (AA[i] + 1)) < 1e-5).toBe(true);
  }
  tvm.endScope();

  // assert auto release scope behavior
  expect(sysLib.getHandle(false)).toBe(0);
  // fadd is not released because it is detached
  expect(faddOne._tvmPackedCell.handle).not.toBe(0);
  faddOne.dispose();
  expect(A.getHandle(false)).toBe(0);
  expect(B.getHandle(false)).toBe(0);
});
