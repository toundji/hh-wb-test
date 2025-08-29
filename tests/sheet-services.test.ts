global.fetch = jest.fn();

// Mocks des modules externes
jest.mock('#repository/spreadsheets.repo.js', () => ({
  __esModule: true,
  default: {
    listIds: jest.fn()
  }
}));

jest.mock('#repository/wbprice.repo.js', () => ({
  __esModule: true,
  default: {
    getByDateSortedByCoefAsc: jest.fn()
  }
}));

jest.mock('#repository/sheetsclient.js', () => ({
  __esModule: true,
  sheets: {
    spreadsheets: {
      batchUpdate: jest.fn(),
      values: {
        clear: jest.fn(),
        update: jest.fn()
      }
    }
  }
}));

const mockPLimit = jest.fn();
const mockLimitFn = jest.fn();

jest.mock('p-limit', () => {
  return mockPLimit.mockImplementation(() => mockLimitFn);
});

// Dans votre beforeEach
beforeEach(() => {
  jest.clearAllMocks();
  mockLimitFn.mockImplementation((fn) => fn());
});

// Import des modules après les mocks

import { sheets } from "#repository/sheetsclient.js";
import { 
  createSheet, 
  toSheetRows, 
  writeSheet, 
} from "#services/sheets.service.js";


describe('sheetservice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toSheetRows', () => {
    it('should convert WbPriceDb array to sheet rows with header', () => {
      const mockPriceList = [
        {
          id: 1,
          warehouse_name: 'Коледино',
          geo_name: 'Центральный федеральный округ',
          box_delivery_base: 63,
          box_delivery_coef_expr: 180,
          box_delivery_liter: 15.3,
          box_delivery_marketplace_base: 35,
          box_delivery_marketplace_coef_expr: 100,
          box_delivery_marketplace_liter: 8.5,
          box_storage_base: 0.1,
          box_storage_coef_expr: 145,
          box_storage_liter: 0.1,
          date: '2024-01-01',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      const result = toSheetRows(mockPriceList);

      console.log()
      expect(result).toHaveLength(2); // Header + 1 row
      expect(result[0]).toEqual([
        "warehouseName","geoName",
        "boxDeliveryBase","boxDeliveryCoefExpr","boxDeliveryLiter",
        "boxDeliveryMarketplaceBase", "boxDeliveryMarketplaceCoefExpr",
        "boxDeliveryMarketplaceLiter", "boxStorageBase", 
        "boxStorageCoefExpr", "boxStorageLiter", "date",
      ]);
      expect(result[1]).toEqual([
        'Коледино', 'Центральный федеральный округ',
        '63',        '180',        '15,3',
        '35',        '100',        '8,5',        '0,1',
        '145',        '0,1',        '2024-01-01'
      ]);
    });

    it('should handle empty array', () => {
      const result = toSheetRows([]);
      expect(result).toHaveLength(1); // Only header
      expect(result[0]).toHaveLength(12); // Header columns
    });
  });

  describe('createSheet', () => {
    it('should create sheet successfully', async () => {
      const spreadsheetId = 'test-spreadsheet-id';
      const mockBatchUpdate = sheets.spreadsheets.batchUpdate as jest.Mock;
      mockBatchUpdate.mockResolvedValue({});

      await createSheet(spreadsheetId);

      expect(mockBatchUpdate).toHaveBeenCalledWith({
        spreadsheetId,
        requestBody: {
          requests: [
            { addSheet: { properties: { title: "stocks_coefs" } } },
          ],
        },
      });
    });

    it('should throw error on failure', async () => {
      const spreadsheetId = 'test-spreadsheet-id';
      const mockBatchUpdate = sheets.spreadsheets.batchUpdate as jest.Mock;
      mockBatchUpdate.mockRejectedValue(new Error('API error'));

      await expect(createSheet(spreadsheetId)).rejects.toThrow('API error');
    });
  });

  describe('writeSheet', () => {
    const spreadsheetId = 'test-spreadsheet-id';
    const values = [['header1', 'header2'], ['value1', 'value2']];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should write to sheet successfully', async () => {
      const mockClear = sheets.spreadsheets.values.clear as jest.Mock;
      const mockUpdate = sheets.spreadsheets.values.update as jest.Mock;
      
      mockClear.mockResolvedValue({});
      mockUpdate.mockResolvedValue({});

      await writeSheet(spreadsheetId, values);

      expect(mockClear).toHaveBeenCalledWith({
        spreadsheetId,
        range: "stocks_coefs"
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        spreadsheetId,
        range: "stocks_coefs!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });
    });
  });
});