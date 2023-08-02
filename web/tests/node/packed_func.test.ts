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
import { expect } from 'vitest';
import { tvmTest } from './tvmTest';

tvmTest("GetGlobal", ({tvm}) => {
  tvm.beginScope();
  let flist = tvm.listGlobalFuncNames();
  let faddOne = tvm.getGlobalFunc("testing.add_one");
  let fecho = tvm.getGlobalFunc("testing.echo");

  expect(faddOne(tvm.scalar(1, "int"))).toBe(2);
  expect(faddOne(tvm.scalar(-1, "int"))).toBe(0);

  // check function argument with different types.
  expect(fecho(1123)).toBe(1123);
  expect(fecho("xyz")).toBe("xyz");

  let bytes = new Uint8Array([1, 2, 3]);
  let rbytes = fecho(bytes);
  expect(rbytes.length).toBe(bytes.length);

  for (let i = 0; i < bytes.length; ++i) {
    expect(rbytes[i]).toBe(bytes[i]);
  }

  expect(fecho(undefined)).toBe(undefined);

  tvm.beginScope();

  let arr = tvm.empty([2, 2]).copyFrom([1, 2, 3, 4]);
  let arr2 = fecho(arr);
  expect(arr2.getHandle()).toBe(arr.getHandle());
  expect(arr2.toArray().toString()).toBe(arr.toArray().toString());

  tvm.moveToParentScope(arr2);
  tvm.endScope();
  // test move to parent scope and tracking
  expect(arr2.getHandle(false)).toBe(0);
  expect(arr2.handle).not.toBe(0);

  let mod = tvm.systemLib();
  let ret = fecho(mod);
  expect(ret.getHandle()).toBe(mod.getHandle());
  expect(flist.length).toBeGreaterThan(0);
  tvm.endScope();

  // assert auto release scope behavior
  expect(mod.getHandle(false)).toBe(0);
  expect(ret.getHandle(false)).toBe(0);
  expect(arr.getHandle(false)).toBe(0);
  expect(fecho._tvmPackedCell.getHandle(false)).toBe(0);
  expect(faddOne._tvmPackedCell.getHandle(false)).toBe(0);
});

tvmTest("ReturnFunc", ({tvm}) => {
  tvm.beginScope();
  function addy(y) {
    function add(x, z) {
      return x + y + z;
    }
    return add;
  }

  let fecho = tvm.getGlobalFunc("testing.echo");
  let myf = tvm.toPackedFunc(addy);
  expect(tvm.isPackedFunc(myf)).toBe(true);
  let myf2 = tvm.toPackedFunc(myf);
  expect(myf2._tvmPackedCell.handle).toBe(myf._tvmPackedCell.handle);
  let f = myf(10);

  expect(tvm.isPackedFunc(f)).toBe(true);
  expect(f(11, 0)).toBe(21);
  expect(f("x", 1)).toBe("x101");
  expect(f("x", "yz")).toBe("x10yz");

  fecho.dispose();
  myf.dispose();
  myf2.dispose();
  // test multiple dispose.
  f.dispose();
  f.dispose();
  tvm.endScope();
});

tvmTest("RegisterGlobal", ({tvm}) => {
  tvm.beginScope();
  tvm.registerFunc("xyz", function (x, y) {
    return x + y;
  });

  let f = tvm.getGlobalFunc("xyz");
  expect(f(1, 2)).toBe(3);
  f.dispose();

  let syslib = tvm.systemLib();
  syslib.dispose();
  tvm.endScope();
});

tvmTest("NDArrayCbArg", ({tvm}) => {
  tvm.beginScope();
  let use_count = tvm.getGlobalFunc("testing.object_use_count");
  let record = [];

  let fcheck = tvm.toPackedFunc(function (x, retain) {
    expect(use_count(x)).toBe(2);
    expect(x.handle).not.toBe(0);
    record.push(x);
    if (retain) {
      tvm.detachFromCurrentScope(x);
    }
  });

  let x = tvm.empty([2], "float32").copyFrom([1, 2]);
  expect(use_count(x)).toBe(1);

  fcheck(x, 0);
  // auto-released when it is out of scope.
  expect(record[0].getHandle(false)).toBe(0);

  expect(use_count(x)).toBe(1);

  fcheck(x, 1);
  expect(use_count(x)).toBe(2);
  expect(record[1].handle).not.toBe(0);
  tvm.attachToCurrentScope(record[1]);
  tvm.endScope();
  expect(record[1].getHandle(false)).toBe(0);
});

tvmTest("Logging", ({tvm}) => {
  tvm.beginScope();
  const log_info = tvm.getGlobalFunc("testing.log_info_str");
  log_info("helow world")
  log_info.dispose();
  tvm.endScope();
});
