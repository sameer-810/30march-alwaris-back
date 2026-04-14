import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createResourceService } from "./createResourceService.js";
import { AppError } from "../../../utils/AppError.js";

describe("createResourceService", () => {
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      createWithAutoJobNo: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
      softDeleteById: jest.fn(),
    };
  });

  describe("create", () => {
    it("delegates to the correct repository method", async () => {
      mockRepository.createWithAutoJobNo.mockResolvedValue({ id: 1 });

      const service = createResourceService({
        repository: mockRepository,
        createMethod: "createWithAutoJobNo",
      });

      const result = await service.create({ name: "Test" });

      expect(mockRepository.createWithAutoJobNo).toHaveBeenCalledWith({
        name: "Test",
      });
      expect(result).toEqual({ id: 1 });
    });

    it("executes beforeCreate hook if provided", async () => {
      mockRepository.createWithAutoJobNo.mockResolvedValue({});
      const beforeCreateMock = jest.fn().mockResolvedValue();

      const service = createResourceService({
        repository: mockRepository,
        createMethod: "createWithAutoJobNo",
        beforeCreate: beforeCreateMock,
      });

      await service.create({ name: "Test" });

      expect(beforeCreateMock).toHaveBeenCalledWith({ name: "Test" });
      expect(mockRepository.createWithAutoJobNo).toHaveBeenCalled();
    });

    it("maps create payload using mapCreatePayload if provided", async () => {
      mockRepository.createWithAutoJobNo.mockResolvedValue({});
      const mapCreatePayloadMock = jest.fn((payload) => ({
        ...payload,
        mapped: true,
      }));

      const service = createResourceService({
        repository: mockRepository,
        createMethod: "createWithAutoJobNo",
        mapCreatePayload: mapCreatePayloadMock,
      });

      await service.create({ name: "Test" });

      expect(mapCreatePayloadMock).toHaveBeenCalledWith({ name: "Test" });
      expect(mockRepository.createWithAutoJobNo).toHaveBeenCalledWith({
        name: "Test",
        mapped: true,
      });
    });
  });

  describe("get", () => {
    it("returns resource if found", async () => {
      mockRepository.findById.mockResolvedValue({ id: 1, name: "Test" });
      const service = createResourceService({ repository: mockRepository });

      const result = await service.get("1");
      expect(result).toEqual({ id: 1, name: "Test" });
    });

    it("throws a 404 AppError if resource not found", async () => {
      mockRepository.findById.mockResolvedValue(null);
      const service = createResourceService({
        repository: mockRepository,
        notFoundMessage: "Item not found",
      });

      await expect(service.get("1")).rejects.toThrow(AppError);
      await expect(service.get("1")).rejects.toMatchObject({
        statusCode: 404,
        message: "Item not found",
      });
    });
  });

  describe("update", () => {
    it("returns updated resource if successful", async () => {
      mockRepository.updateById.mockResolvedValue({ id: 1, name: "Updated" });
      const service = createResourceService({ repository: mockRepository });

      const result = await service.update("1", { name: "Updated" });
      expect(result).toEqual({ id: 1, name: "Updated" });
    });

    it("throws a 404 AppError if resource to update does not exist", async () => {
      mockRepository.updateById.mockResolvedValue(null);
      const service = createResourceService({
        repository: mockRepository,
        notFoundMessage: "Item not found",
      });

      await expect(service.update("1", {})).rejects.toThrow(AppError);
    });

    it("executes hooks beforeUpdate and mapUpdatePatch", async () => {
      mockRepository.updateById.mockResolvedValue({ id: 1 });
      const beforeUpdateMock = jest.fn();
      const mapUpdatePatchMock = jest.fn((patch) => ({
        ...patch,
        hydrated: true,
      }));

      const service = createResourceService({
        repository: mockRepository,
        beforeUpdate: beforeUpdateMock,
        mapUpdatePatch: mapUpdatePatchMock,
      });

      await service.update("1", { name: "New" });

      expect(beforeUpdateMock).toHaveBeenCalledWith({ name: "New" });
      expect(mapUpdatePatchMock).toHaveBeenCalledWith({ name: "New" });
      expect(mockRepository.updateById).toHaveBeenCalledWith("1", {
        name: "New",
        hydrated: true,
      });
    });
  });

  describe("remove", () => {
    it("soft deletes resource and returns it", async () => {
      mockRepository.softDeleteById.mockResolvedValue({
        id: 1,
        isDeleted: true,
      });
      const service = createResourceService({ repository: mockRepository });

      const result = await service.remove("1");
      expect(mockRepository.softDeleteById).toHaveBeenCalledWith("1");
      expect(result).toEqual({ id: 1, isDeleted: true });
    });

    it("throws a 404 AppError if resource to delete does not exist", async () => {
      mockRepository.softDeleteById.mockResolvedValue(null);
      const service = createResourceService({
        repository: mockRepository,
        notFoundMessage: "Item not found",
      });

      await expect(service.remove("1")).rejects.toThrow(AppError);
    });
  });
});
