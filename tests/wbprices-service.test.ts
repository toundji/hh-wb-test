jest.mock('#config/env/env.js', () => ({
  __esModule: true,
  default: {
    NODE_ENV: 'test',
    POSTGRES_HOST: 'localhost',
    POSTGRES_PORT: '5432',
    POSTGRES_DB: 'test_db',
    POSTGRES_USER: 'test_user',
    POSTGRES_PASSWORD: 'test_password'
  }
}));

jest.mock('#config/env/wb.config.js', () => ({
  __esModule: true,
  default: {
    WB_API_URL: 'http://json-server',
    WB_API_TOKEN: 'adefrgyhxxxx',
  }
}));

// Mock de knex
jest.mock('#postgres/knex.js', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    insert: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([]),
  }))
}));

// Mock du repository
jest.mock('#repository/wbprice.repo.js', () => ({
  __esModule: true,
  default: {
    saveAll: jest.fn().mockResolvedValue([])
  }
}));





import priceRepo from "#repository/wbprice.repo.js";
import { WbApiResponseDto, WbPriceDb } from "#dto/price.dto.js";
import { fetchWbPrices, savePrices } from "#services/wbprices.service.js";
import { getToDay } from "#utils/util.js";



describe("pricesheetservice", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchWbPrices", () => {
    it("should fetch and parse WB prices correctly", async () => {
      const today = getToDay();

      const mockResponse = {
        response: {
          data: {
            dtNextBox: today,
            dtTillMax: today,
            warehouseList: [
              {
                boxDeliveryBase: "63",
                boxDeliveryCoefExpr: "180",
                boxDeliveryLiter: "15,3",
                boxDeliveryMarketplaceBase: "35",
                boxDeliveryMarketplaceCoefExpr: "100",
                boxDeliveryMarketplaceLiter: "8,5",
                boxStorageBase: "0,1",
                boxStorageCoefExpr: "145",
                boxStorageLiter: "0,1",
                geoName: "Центральный федеральный округ",
                warehouseName: "Коледино"
              }
            ]
          }
        }
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result: WbApiResponseDto = await fetchWbPrices(today);

      expect(result.warehouseList).toHaveLength(1);
      expect(result.warehouseList[0].warehouseName).toBe("Коледино");
      expect(result.warehouseList[0].boxDeliveryBase).toBe(63);
    });

    it("should throw error if fetch fails", async () => {
      const today = getToDay();

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(fetchWbPrices(today)).rejects.toThrow(
        /WB API error: 500/
      );
    });
  });

  describe("savePrices", () => {
    it("should call priceRepo.saveAll with correct data", async () => {
      const today = getToDay();

      const mockPrices: WbApiResponseDto = {
        dtNextBox: today,
        dtTillMax: today,
        warehouseList: [
          {
            boxDeliveryBase: 63,
            boxDeliveryCoefExpr: 180,
            boxDeliveryLiter: 15.3,
            boxDeliveryMarketplaceBase: 35,
            boxDeliveryMarketplaceCoefExpr: 100,
            boxDeliveryMarketplaceLiter: 8.5,
            boxStorageBase: 0.1,
            boxStorageCoefExpr: 145,
            boxStorageLiter: 0.1,
            geoName: "Центральный федеральный округ",
            warehouseName: "Коледино"
          }
        ]
      };

      const saveAllMock = jest
        .spyOn(priceRepo, "saveAll")
        .mockResolvedValue([] as WbPriceDb[]);

      await savePrices(today, mockPrices);

      expect(saveAllMock).toHaveBeenCalledWith([
        expect.objectContaining({
          warehouse_name: "Коледино",
          geo_name: "Центральный федеральный округ",
          date: today,
          box_delivery_base: 63
        })
      ]);
    });

    it("should propagate error from priceRepo.saveAll", async () => {
      const today = getToDay();

      const mockPrices: WbApiResponseDto = {
        dtNextBox: today,
        dtTillMax: today,
        warehouseList: [
          {
            boxDeliveryBase: 63,
            boxDeliveryCoefExpr: 180,
            boxDeliveryLiter: 15.3,
            boxDeliveryMarketplaceBase: 35,
            boxDeliveryMarketplaceCoefExpr: 100,
            boxDeliveryMarketplaceLiter: 8.5,
            boxStorageBase: 0.1,
            boxStorageCoefExpr: 145,
            boxStorageLiter: 0.1,
            geoName: "Центральный федеральный округ",
            warehouseName: "Коледино"
          }
        ]
      };

      jest.spyOn(priceRepo, "saveAll").mockRejectedValue(new Error("DB error"));

      await expect(savePrices(today, mockPrices)).rejects.toThrow(
        /DB error/
      );
    });
  });
});