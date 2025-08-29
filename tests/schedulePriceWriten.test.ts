jest.mock('node-cron', () => ({
  schedule: jest.fn().mockImplementation((cronExpression, callback) => {
    // Retourne un objet avec les méthodes de cron
    return {
      start: jest.fn(),
      stop: jest.fn()
    };
  })
}));

jest.mock('#services/wbprices.service.js', () => ({
  fetchAndSavePrices: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('#services/sheets.service.js', () => ({
  syncAllSheetsForDay: jest.fn().mockResolvedValue(undefined)
}));

console.log = jest.fn();

import { fetchAndSavePrices } from '#services/wbprices.service.js';
import { syncAllSheetsForDay } from '#services/sheets.service.js';
import {  job } from '#services/job.service.js'; // Remplacez par le bon chemin

describe('schedulePriceWriten', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('job function', () => {
    it('should execute fetchAndSavePrices and syncAllSheetsForDay', async () => {
      // Execution
      const result = await job();

      // Vérifications
      expect(fetchAndSavePrices).toHaveBeenCalledWith('2024-01-15');
      expect(syncAllSheetsForDay).toHaveBeenCalledWith('2024-01-15');
      expect(console.log).toHaveBeenCalledWith('Hourly job done');
      expect(result).toBe(true);
    });
  });

 
});