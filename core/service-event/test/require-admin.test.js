import { jest, describe, it, expect } from '@jest/globals';
import { makeGetPendingEvents } from '../src/application/use-cases/get-pending-events.use-case.js';
import { AdminRoleRequiredError } from '../src/domain/errors/index.js';

describe('getPendingEvents use-case', () => {
  it('rejects non-admin actors', async () => {
    const eventRepo = { findAll: jest.fn() };
    const getPendingEvents = makeGetPendingEvents({ eventRepo });

    await expect(getPendingEvents('USER')).rejects.toBeInstanceOf(AdminRoleRequiredError);
    expect(eventRepo.findAll).not.toHaveBeenCalled();
  });

  it('returns draft events for admin actors', async () => {
    const eventRepo = { findAll: jest.fn().mockResolvedValue([{ id: '1', status: 'DRAFT' }]) };
    const getPendingEvents = makeGetPendingEvents({ eventRepo });

    const result = await getPendingEvents('ADMIN');

    expect(eventRepo.findAll).toHaveBeenCalledWith({ status: 'DRAFT' });
    expect(result).toHaveLength(1);
  });
});
