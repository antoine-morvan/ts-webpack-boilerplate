/* eslint-disable mocha/no-top-level-hooks */

import { MyLibrary } from "@tsboilerplate/library-api";

beforeEach(function () {
  // do something if needed
});

afterEach(function () {
  // reset dummy counter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (MyLibrary as any).COUNTER = 0;
});
