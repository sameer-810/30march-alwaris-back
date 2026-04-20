import {
  escapeRegex,
  createCounterFieldHelpers,
} from "./resourceRepositoryHelpers.js";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("resourceRepositoryHelpers", () => {
  describe("escapeRegex", () => {
    it("should escape special regex characters in a string", () => {
      const input = "test[.*+?^${}()|"; // A string with regex meta-characters
      const result = escapeRegex(input);

      // we expect slashes to be added before special characters
      expect(result).toBe("test\\[\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|");
    });

    it("should safely handle non-special characters", () => {
      expect(escapeRegex("hello world")).toBe("hello world");
      expect(escapeRegex("user123")).toBe("user123");
    });

    it("should handle numbers and booleans by coercing them to strings", () => {
      expect(escapeRegex(123)).toBe("123");
      expect(escapeRegex(true)).toBe("true");
    });
  });

  describe("createCounterFieldHelpers", () => {
    let mockDocSave;
    let mockModel;
    let mockCounterModel;
    let helpers;

    beforeEach(() => {
      mockDocSave = jest.fn();
      mockModel = jest.fn().mockImplementation(() => ({
        save: mockDocSave,
      }));
      mockModel.find = jest.fn();
      mockModel.updateOne = jest.fn();

      mockCounterModel = {
        findByIdAndUpdate: jest.fn(),
      };

      helpers = createCounterFieldHelpers({
        model: mockModel,
        counterModel: mockCounterModel,
        counterId: "myCounter",
        fieldName: "jobNo",
      });
    });

    it("should retry automatically if MongoDB throws an E11000 collision on the sequence field", async () => {
      // Mock the counter to return 100 on first try, 101 on second try
      mockCounterModel.findByIdAndUpdate
        .mockReturnValueOnce({
          lean: jest.fn().mockResolvedValue({ seq: 100 }),
        })
        .mockReturnValueOnce({
          lean: jest.fn().mockResolvedValue({ seq: 101 }),
        });

      // Mock save to throw an E11000 duplicated sequence exception on the first try
      const collisionError = new Error("E11000 duplicate key error");
      collisionError.code = 11000;
      collisionError.keyPattern = { jobNo: 1 };

      mockDocSave
        .mockRejectedValueOnce(collisionError)
        .mockResolvedValue({ _id: "new_doc", jobNo: 101 }); // Success on second try

      const result = await helpers.createWithAutoValue({ name: "Bob" });

      expect(mockCounterModel.findByIdAndUpdate).toHaveBeenCalledTimes(2);
      expect(mockDocSave).toHaveBeenCalledTimes(2);

      // Ensures the final object successfully populated with the *second* sequence
      expect(result).toEqual({ _id: "new_doc", jobNo: 101 });
    });

    it("should instantly throw if an unrelated field throws a duplicate key error", async () => {
      mockCounterModel.findByIdAndUpdate.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValue({ seq: 100 }),
      });

      // Simulate a duplicate key on a different unique index (like an email)
      const diffError = new Error("E11000 duplicate key error");
      diffError.code = 11000;
      diffError.keyPattern = { email: 1 };

      mockDocSave.mockRejectedValueOnce(diffError);

      await expect(
        helpers.createWithAutoValue({ name: "Bob" }),
      ).rejects.toThrow(diffError);

      // Save was only attempted once. It aborted instead of retrying forever.
      expect(mockDocSave).toHaveBeenCalledTimes(1);
      expect(mockCounterModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
