// Mock des dépendances Google
jest.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn().mockImplementation(() => ({
        authorize: jest.fn().mockResolvedValue(undefined),
        request: jest.fn().mockResolvedValue({})
      }))
    },
    sheets: jest.fn().mockReturnValue({
      spreadsheets: {
        values: {
          clear: jest.fn().mockResolvedValue({}),
          update: jest.fn().mockResolvedValue({})
        }
      }
    })
  }
}));

// Mock de p-limit
jest.mock('p-limit', () => {
  return jest.fn(() => {
    return (fn: () => any) => Promise.resolve(fn());
  });
});

// Mock de la configuration
jest.mock('#config/env/google.config.js', () => ({
  __esModule: true,
  default: {
    NODE_ENV: 'test',
    GOOGLE_PRIVATE_KEY: "test-key",
    GOOGLE_CLIENT_EMAIL: "test@example.com"
  }
}));

// Mock du client sheets
jest.mock('#repository/sheetsclient.js', () => ({
  __esModule: true,
  sheets: {
    spreadsheets: {
      values: {
        clear: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({})
      }
    }
  }
}));

// MOCK CORRIGÉ : Export default comme dans le code réel
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

// Import APRÈS les mocks
import spreadsheetsRepo from '#repository/spreadsheets.repo.js';
import wbpriceRepo from '#repository/wbprice.repo.js';
import { syncAllSheetsForDay } from '#services/sheets.service.js';

describe('syncAllSheetsForDay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sync all sheets successfully', async () => {
    // Configuration des mocks - utilisez .default si nécessaire
    (spreadsheetsRepo.listIds as jest.Mock).mockResolvedValue(['spreadsheet1', 'spreadsheet2', 'spreadsheet3']);
    (wbpriceRepo.getByDateSortedByCoefAsc as jest.Mock).mockResolvedValue([
      {
        warehouse_name: 'Коледино',
        geo_name: 'Центральный федеральный округ',
        date: '2024-01-01'
      }
    ]);

    // Execution
    await syncAllSheetsForDay('2024-01-01');

    // Vérifications
    expect(spreadsheetsRepo.listIds).toHaveBeenCalled();
    expect(wbpriceRepo.getByDateSortedByCoefAsc).toHaveBeenCalledWith('2024-01-01');
  });

  it('should handle empty spreadsheet list', async () => {
    (spreadsheetsRepo.listIds as jest.Mock).mockResolvedValue([]);
    (wbpriceRepo.getByDateSortedByCoefAsc as jest.Mock).mockResolvedValue([]);

    await syncAllSheetsForDay('2024-01-01');

    expect(spreadsheetsRepo.listIds).toHaveBeenCalled();
    expect(wbpriceRepo.getByDateSortedByCoefAsc).toHaveBeenCalledWith('2024-01-01');
  });
});