import { MyLibrary } from "@tsboilerplate/library-api";
import { assert } from "chai";

describe("Library test", function () {
  it("Should test setup", function () {
    assert(new MyLibrary().getId() === 0);
    assert(new MyLibrary().getId() === 1);
  });

  it("Should test setup 2", function () {
    assert(new MyLibrary().getId() === 0);
  });
});
