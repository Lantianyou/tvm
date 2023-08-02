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
import { expect } from 'vitest'
import tvmjs from '../../dist/tvmjs.bundle'
import { tvmTest } from './tvmTest';


tvmTest("object", ({tvm}) => {
  tvm.withNewScope(() => {
    const data = [1, 2, 3, 4, 5, 6];
    const a = tvm.empty([2, 3], "float32").copyFrom(data);

    const t = tvm.makeTVMArray([]);
    const b = tvm.makeTVMArray([a, t]);
    // assert b instanceof tvmjs.TVMArray
    expect(b instanceof tvmjs.TVMArray).toBe(true);
    expect(b.size()).toBe(2);

    const t1 = b.get(1);
    expect(t1.getHandle()).toBe(t.getHandle());

    const s0 = tvm.makeString("hello world");
    expect(s0.toString()).toBe("hello world");
    s0.dispose();

    const ret_string = tvm.getGlobalFunc("testing.ret_string");
    const s1 = ret_string("hello");
    expect(s1.toString()).toBe("hello");
    ret_string.dispose();
    s1.dispose();
  });
});
