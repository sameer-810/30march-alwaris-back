import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// 1. First, define the mock for the repository
const mockRepository = {
  createWithAutoJobNo: jest.fn(),
  updateById: jest.fn(),
  findMany: jest.fn(),
  findById: jest.fn(),
  softDeleteById: jest.fn(),
  getNextGeneratedReference: jest.fn(),
};

// 2. Mock the import before importing the service
jest.unstable_mockModule("./booking.repository.js", () => ({
  bookingRepository: mockRepository,
}));

// 3. Dynamically import the service under test
const { bookingService } = await import("./booking.service.js");

describe("booking.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Financial Calculations on Create", () => {
    it("should calculate amounts and totals accurately for create payload", async () => {
      mockRepository.createWithAutoJobNo.mockResolvedValue({ id: 1 });

      const payload = {
        shipper: "Test Shipper",
        incomeDetails: [
          { qty: 2, rate: 100.5, exRate: 3.67 }, // Amount = 737.67
          { qty: 1, rate: 50, exRate: 1 }, // Amount = 50.00
        ],
        expenseDetails: [
          { qty: 1, rate: 200, exRate: 3.67 }, // Amount = 734.00
        ],
      };

      await bookingService.create(payload);

      expect(mockRepository.createWithAutoJobNo).toHaveBeenCalledTimes(1);

      const modifiedPayload =
        mockRepository.createWithAutoJobNo.mock.calls[0][0];

      // Row-level checks
      expect(modifiedPayload.incomeDetails[0].amount).toBe(737.67);
      expect(modifiedPayload.incomeDetails[1].amount).toBe(50);
      expect(modifiedPayload.expenseDetails[0].amount).toBe(734);

      // Aggregated totals
      expect(modifiedPayload.incomeTotalInAed).toBe(787.67);
      expect(modifiedPayload.expenseTotalInAed).toBe(734);
      expect(modifiedPayload.netAmountInAed).toBe(53.67); // 787.67 - 734
    });

    it("should handle missing income or expense arrays defaulting to zero", async () => {
      mockRepository.createWithAutoJobNo.mockResolvedValue({ id: 2 });

      await bookingService.create({ shipper: "No Finance" });

      const modifiedPayload =
        mockRepository.createWithAutoJobNo.mock.calls[0][0];

      expect(modifiedPayload.incomeTotalInAed).toBe(0);
      expect(modifiedPayload.expenseTotalInAed).toBe(0);
      expect(modifiedPayload.netAmountInAed).toBe(0);
    });
  });

  describe("Financial Calculations on Update", () => {
    it("should accurately recalculate amounts and totals when patch contains rows", async () => {
      mockRepository.updateById.mockResolvedValue({ id: 1 });

      const patch = {
        expenseDetails: [
          { qty: 1, rate: 100, exRate: 1 }, // Amount = 100
          { qty: 1, rate: 300, exRate: 3.67 }, // Amount = 1101
        ],
        incomeTotalInAed: 5000,
        // If income is not patched, the backend's logic explicitly looks at the
        // incomeTotalInAed fed into it? Wait, yes, the update calculates net based on what is in the patch!
      };

      await bookingService.update("1", patch);

      const modifiedPatch = mockRepository.updateById.mock.calls[0][1];

      // Row recalculation
      expect(modifiedPatch.expenseDetails[0].amount).toBe(100);
      expect(modifiedPatch.expenseDetails[1].amount).toBe(1101);

      // Total expense recalculation
      expect(modifiedPatch.expenseTotalInAed).toBe(1201);

      // Net Amount (Income provided in patch 5000 - Expense updated to 1201)
      expect(modifiedPatch.netAmountInAed).toBe(3799);
    });
  });
});
