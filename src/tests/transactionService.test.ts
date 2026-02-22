import { validTransitions } from "../domain/transaction.state";

describe("Transaction state transitions", () => {

  describe("Transitions for CREATED", () => {
    test("should allow CREATED -> PENDING_3DS", () => {
      expect(validTransitions["CREATED"]).toContain("PENDING_3DS");
    });

    test("should allow CREATED -> SUCCESS", () => {
      expect(validTransitions["CREATED"]).toContain("SUCCESS");
    });

    test("should allow CREATED -> FAILED", () => {
      expect(validTransitions["CREATED"]).toContain("FAILED");
    });
  });

  describe("Transitions for PENDING_3DS", () => {
    test("should allow PENDING_3DS -> SUCCESS", () => {
      expect(validTransitions["PENDING_3DS"]).toContain("SUCCESS");
    });

    test("should allow PENDING_3DS -> FAILED", () => {
      expect(validTransitions["PENDING_3DS"]).toContain("FAILED");
    });

    test("should NOT allow PENDING_3DS to go back to CREATED", () => {
      expect(validTransitions["PENDING_3DS"]).not.toContain("CREATED");
    });
  });

  describe("Transitions for SUCCESS and FAILED", () => {
    test("SUCCESS should be empty", () => {
      expect(validTransitions["SUCCESS"]).toEqual([]);
    });

    test("FAILED should be empty", () => {
      expect(validTransitions["FAILED"]).toEqual([]);
    });
  });

  test("should not have any undefined states", () => {
    expect(validTransitions["CREATED"]).toBeDefined();
    expect(validTransitions["PENDING_3DS"]).toBeDefined();
    expect(validTransitions["SUCCESS"]).toBeDefined();
    expect(validTransitions["FAILED"]).toBeDefined();
  });
});