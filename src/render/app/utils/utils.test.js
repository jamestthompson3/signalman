import { areDifferent } from "./diff";

describe("Diffs different arrays and objects", () => {
  it("diffs arrays of objects", () => {
    const source1 = [{ name: "test" }];
    const target1 = [{ name: "test" }];
    expect(areDifferent(source1, target1)).toBe(false);
    const source2 = [];
    const target2 = [{ name: "test" }];
    expect(areDifferent(source2, target2)).toBe(true);
    const source3 = [{ title: "test" }];
    const target3 = [{ name: "test" }];
    expect(areDifferent(source3, target3)).toBe(true);
    const source4 = [];
    const target4 = [];
    expect(areDifferent(source4, target4)).toBe(false);
  });
  it("diffs arrays", () => {
    const source1 = ["test"];
    const target1 = ["test"];
    expect(areDifferent(source1, target1)).toBe(false);
    const source2 = ["name"];
    const target2 = ["test"];
    expect(areDifferent(source2, target2)).toBe(true);
    const source3 = ["name", "test"];
    const target3 = ["test"];
    expect(areDifferent(source3, target3)).toBe(true);
  });
});
