import { describe, it, expect } from 'vitest';

import {
  transformApiAccountsToAccountItems,
  AccountItem,
} from './account-name-list';

import type { ApiAccountNameListResponse } from '@/features/project/api';

describe('transformApiAccountsToAccountItems', () => {
  it('should transform a list of account names correctly', () => {
    const apiAccountList: ApiAccountNameListResponse[] = [
      { account_name: 'Account1' },
      { account_name: 'Account2' },
    ];

    const expected: AccountItem[] = [
      { label: 'Account1', value: 'Account1' },
      { label: 'Account2', value: 'Account2' },
    ];

    const result = transformApiAccountsToAccountItems(apiAccountList);
    expect(result).toEqual(expected);
  });

  it('should return an empty array when given an empty list', () => {
    const apiAccountList: ApiAccountNameListResponse[] = [];
    const expected: AccountItem[] = [];

    const result = transformApiAccountsToAccountItems(apiAccountList);
    expect(result).toEqual(expected);
  });

  it('should handle a list with one account name', () => {
    const apiAccountList: ApiAccountNameListResponse[] = [
      { account_name: 'SingleAccount' },
    ];

    const expected: AccountItem[] = [
      { label: 'SingleAccount', value: 'SingleAccount' },
    ];

    const result = transformApiAccountsToAccountItems(apiAccountList);
    expect(result).toEqual(expected);
  });

  it('should not modify the input array', () => {
    const apiAccountList: ApiAccountNameListResponse[] = [
      { account_name: 'ImmutableAccount' },
    ];

    const originalList = [...apiAccountList];
    transformApiAccountsToAccountItems(apiAccountList);

    expect(apiAccountList).toEqual(originalList);
  });
});
