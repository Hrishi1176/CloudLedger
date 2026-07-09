import { getTenantDb } from '@sales-crm/database';

export type VoucherEntryInput = {
  accountId: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
};

export type InventoryEntryInput = {
  itemId: string;
  quantity: number; // Positive = inward (purchase), Negative = outward (sales)
  rate: number;
  amount: number;
};

export type CreateVoucherInput = {
  voucherNumber: string;
  date: Date;
  type: string; // 'Sales', 'Purchase', 'Payment', 'Receipt', 'Journal', 'Contra'
  narration?: string;
  entries: VoucherEntryInput[];
  inventoryEntries?: InventoryEntryInput[];
};

export async function createVoucher(subdomain: string, input: CreateVoucherInput) {
  // 1. Validate Debits = Credits
  const totalDebits = input.entries.filter(e => e.type === 'DEBIT').reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = input.entries.filter(e => e.type === 'CREDIT').reduce((sum, e) => sum + e.amount, 0);

  // Allow a small epsilon for floating point issues
  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    throw new Error(`Double entry validation failed. Debits (${totalDebits}) do not equal Credits (${totalCredits}).`);
  }

  // 2. Perform the database transaction
  const tenantDb = await getTenantDb(subdomain);
  const voucher = await tenantDb.voucher.create({
    data: {
      voucherNumber: input.voucherNumber,
      date: input.date,
      type: input.type,
      narration: input.narration,
      entries: {
        create: input.entries.map(e => ({
          accountId: e.accountId,
          amount: e.amount,
          type: e.type,
        })),
      },
      inventoryEntries: input.inventoryEntries ? {
        create: input.inventoryEntries.map(ie => ({
          itemId: ie.itemId,
          quantity: ie.quantity,
          rate: ie.rate,
          amount: ie.amount,
        }))
      } : undefined,
    },
    include: {
      entries: true,
      inventoryEntries: true,
    }
  });

  return voucher;
}

export async function getTrialBalance(subdomain: string) {
  const tenantDb = await getTenantDb(subdomain);
  // Get all accounts and calculate their running balances based on Voucher Entries
  const accounts = await tenantDb.account.findMany({
    include: {
      group: true,
      voucherEntries: {
        include: {
          voucher: true,
        }
      }
    }
  });

  const trialBalance = accounts.map(account => {
    let currentBalance = account.openingBalance; // Assume opening balance follows balanceType (DEBIT/CREDIT)
    
    // Process transactions
    account.voucherEntries.forEach(entry => {
      if (account.balanceType === 'DEBIT') {
        if (entry.type === 'DEBIT') currentBalance += entry.amount;
        else currentBalance -= entry.amount;
      } else { // CREDIT
        if (entry.type === 'CREDIT') currentBalance += entry.amount;
        else currentBalance -= entry.amount;
      }
    });

    return {
      accountId: account.id,
      accountName: account.name,
      groupName: account.group.name,
      balanceType: account.balanceType,
      balance: currentBalance
    };
  });

  return trialBalance;
}

export async function getInventoryValuation(subdomain: string) {
  const tenantDb = await getTenantDb(subdomain);
  const items = await tenantDb.item.findMany({
    include: {
      inventoryEntries: true,
    }
  });

  const valuation = items.map(item => {
    let currentStock = item.openingStock;
    let stockValue = item.openingStock * item.openingRate;

    item.inventoryEntries.forEach(entry => {
      currentStock += entry.quantity; // quantity is + for inward, - for outward
      
      // Basic weighted average or simple FIFO logic. 
      // For simplicity, we just track quantity. Valuation logic can get complex.
      if (entry.quantity > 0) {
        stockValue += entry.amount; // Inward value
      } else {
        // Outward: reduce value based on average rate
        const avgRate = stockValue / (currentStock - entry.quantity || 1);
        stockValue += (entry.quantity * avgRate); 
      }
    });

    return {
      itemId: item.id,
      itemName: item.name,
      uom: item.uom,
      currentStock,
      stockValue,
      avgRate: currentStock > 0 ? stockValue / currentStock : 0
    };
  });

  return valuation;
}
