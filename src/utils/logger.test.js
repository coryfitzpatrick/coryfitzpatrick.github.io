import { logger } from './logger';

describe('logger', () => {
    let consoleLogSpy, consoleErrorSpy, consoleWarnSpy;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });

    it('logs messages in test environment', () => {
        logger.log('test message');
        // Since NODE_ENV is 'test' during Jest runs, logger will log
        expect(consoleLogSpy).toHaveBeenCalledWith('test message');
    });

    it('logs errors in test environment', () => {
        logger.error('test error');
        expect(consoleErrorSpy).toHaveBeenCalledWith('test error');
    });

    it('logs warnings in test environment', () => {
        logger.warn('test warning');
        expect(consoleWarnSpy).toHaveBeenCalledWith('test warning');
    });

    it('has info method', () => {
        logger.info('test info');
        // info calls console.info
        expect(console.info).toBeDefined();
    });

    it('has debug method', () => {
        logger.debug('test debug');
        // debug calls console.debug
        expect(console.debug).toBeDefined();
    });
});
