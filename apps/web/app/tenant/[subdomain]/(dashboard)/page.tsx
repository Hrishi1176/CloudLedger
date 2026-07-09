import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { adminDb, getTenantDb } from '@sales-crm/database';
import { SUBSCRIPTION_PLANS } from '@sales-crm/shared';
import { createVoucher, getTrialBalance, getInventoryValuation } from '@/lib/accounting';
import SubmitButton from './SubmitButton';
import { SuccessToast } from './SuccessToast';
import { ErrorToast } from './ErrorToast';
import BillingPanel from '../BillingPanel';


// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, subColor = 'text-slate-400', accent,
}: {
  label: string; value: string; sub: string; subColor?: string; accent: string;
}) {
  return (
    <div className="relative p-4 md:p-5 lg:p-6 rounded-2xl bg-slate-900 border border-slate-800/70 overflow-hidden group hover:border-slate-700/60 transition-all">
      <div className={`absolute top-0 right-0 h-24 w-24 ${accent} rounded-full translate-x-8 -translate-y-8 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity`} />
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">{label}</p>
      <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-none truncate">{value}</p>
      <p className={`text-xs mt-1.5 font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string; }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function DataTable({ head, children, empty }: { head: React.ReactNode; children: React.ReactNode; empty: boolean }) {
  return (
    <div className="bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
              {head}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
            {empty ? null : children}
          </tbody>
        </table>
        {empty && (
          <div className="py-16 px-6 text-center">
            <p className="text-slate-500 text-sm">No data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none";

// ─── Dashboard Analytics ────────────────────────────────────────────────────────

async function DashboardAnalytics({ subdomain, vouchers }: { subdomain: string, vouchers: any[] }) {
  const [valuation, trialBalance] = await Promise.all([
    getInventoryValuation(subdomain),
    getTrialBalance(subdomain)
  ]);

  // Pre-calculate data for charts
  const topValuation = [...valuation].sort((a, b) => b.stockValue - a.stockValue).slice(0, 5);
  const maxValuation = Math.max(...topValuation.map(s => s.stockValue), 1);

  const topBalances = [...trialBalance]
    .filter(a => Math.abs(a.balance) > 0)
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
    .slice(0, 5);
  const maxBalance = Math.max(...topBalances.map(s => Math.abs(s.balance)), 1);

  const topStock = [...valuation].sort((a, b) => b.currentStock - a.currentStock).slice(0, 5);
  const maxStock = Math.max(...topStock.map(s => s.currentStock), 1);

  const groupBalances = trialBalance.reduce((acc, curr) => {
    acc[curr.groupName] = (acc[curr.groupName] || 0) + Math.abs(curr.balance);
    return acc;
  }, {} as Record<string, number>);
  const groupData = Object.entries(groupBalances).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  const maxGroup = Math.max(...groupData.map(g => g.value), 1);

  const incExp = trialBalance.filter(a => a.groupName === 'Income' || a.groupName === 'Expenses')
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)).slice(0, 5);
  const maxIncExp = Math.max(...incExp.map(a => Math.abs(a.balance)), 1);

  const recentVouchers = vouchers.slice(0, 5);

  return (
    <div className="mt-8 space-y-6">
      <SectionHeader title="Analytics Overview" subtitle="Quick insights into your business." />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Chart 1: Inventory Valuation */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Inventory Valuation</h3>
          <div className="space-y-4">
            {topValuation.length === 0 ? <p className="text-slate-500 text-sm">No data</p> : topValuation.map(item => (
              <div key={item.itemId}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{item.itemName}</span>
                  <span className="text-emerald-400 font-mono">₹{Math.round(item.stockValue).toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${Math.max(5, (item.stockValue / maxValuation) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Top Account Balances */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Top Account Balances</h3>
          <div className="space-y-4">
            {topBalances.length === 0 ? <p className="text-slate-500 text-sm">No data</p> : topBalances.map(acc => {
              const isDr = acc.balanceType === 'DEBIT' && acc.balance >= 0 || acc.balanceType === 'CREDIT' && acc.balance < 0;
              const colorClass = isDr ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500';
              const textClass = isDr ? 'text-indigo-400' : 'text-pink-400';
              return (
                <div key={acc.accountId}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 truncate pr-2">{acc.accountName} <span className="text-[10px] text-slate-500 ml-1">({acc.groupName})</span></span>
                    <span className={`${textClass} font-mono`}>₹{Math.abs(acc.balance).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${colorClass} rounded-full`} style={{ width: `${Math.max(5, (Math.abs(acc.balance) / maxBalance) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Physical Stock Quantities */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Physical Stock (Qty)</h3>
          <div className="space-y-4">
            {topStock.length === 0 ? <p className="text-slate-500 text-sm">No data</p> : topStock.map(item => (
              <div key={item.itemId}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{item.itemName}</span>
                  <span className="text-cyan-400 font-mono">{item.currentStock} <span className="text-[10px] text-slate-500 ml-1">{item.uom}</span></span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${Math.max(5, (item.currentStock / maxStock) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Balances by Account Group */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Balances by Group</h3>
          <div className="space-y-4">
            {groupData.length === 0 ? <p className="text-slate-500 text-sm">No data</p> : groupData.map(group => (
              <div key={group.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{group.name}</span>
                  <span className="text-amber-400 font-mono">₹{Math.round(group.value).toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: `${Math.max(5, (group.value / maxGroup) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 5: Income & Expenses */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Income & Expenses</h3>
          <div className="space-y-4">
            {incExp.length === 0 ? <p className="text-slate-500 text-sm">No data</p> : incExp.map(acc => {
              const isIncome = acc.groupName === 'Income';
              const colorClass = isIncome ? 'from-emerald-400 to-emerald-600' : 'from-rose-400 to-rose-600';
              const textClass = isIncome ? 'text-emerald-400' : 'text-rose-400';
              return (
                <div key={acc.accountId}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 truncate pr-2">{acc.accountName}</span>
                    <span className={`${textClass} font-mono`}>₹{Math.abs(acc.balance).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${colorClass} rounded-full`} style={{ width: `${Math.max(5, (Math.abs(acc.balance) / maxIncExp) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 6: Recent Vouchers */}
        <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Recent Vouchers</h3>
          <div className="space-y-4">
            {recentVouchers.length === 0 ? <p className="text-slate-500 text-sm">No data</p> : recentVouchers.map(v => (
              <div key={v.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-white">{v.voucherNumber}</p>
                  <p className="text-[10px] text-slate-500">{new Date(v.date).toLocaleDateString()}</p>
                </div>
                <div className="text-[10px] font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded uppercase">
                  {v.type}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TenantDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ tab?: string; success?: string }>;
}) {
  const { subdomain } = await params;
  const { tab = 'dashboard', success } = await searchParams;

  const org = await adminDb.organization.findUnique({
    where: { subdomain }
  });

  if (!org) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm">
          <h2 className="text-xl font-bold text-red-400">Organization Not Found</h2>
        </div>
      </div>
    );
  }

  const tenantDb = await getTenantDb(subdomain);
  
  let [accountGroups, accounts, items, vouchers] = await Promise.all([
    tenantDb.accountGroup.findMany(),
    tenantDb.account.findMany({ include: { group: true } }),
    tenantDb.item.findMany(),
    tenantDb.voucher.findMany({ orderBy: { date: 'desc' } })
  ]);

  if (!org) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm">
          <h2 className="text-xl font-bold text-red-400">Organization Not Found</h2>
        </div>
      </div>
    );
  }

  // Ensure default groups exist
  if (accountGroups.length === 0) {
    const defaultGroups = ['Assets', 'Liabilities', 'Income', 'Expenses', 'Equity'];
    for (const g of defaultGroups) {
      await tenantDb.accountGroup.create({ data: { name: g } });
    }
    accountGroups = await tenantDb.accountGroup.findMany();
  }

  const subscriptionPlanCode = org.subscriptionPlan || 'FREE';
  const planConfig = SUBSCRIPTION_PLANS.find(p => p.code === subscriptionPlanCode);
  const allowedModules = planConfig?.allowedModules || ['dashboard'];
  
  const isTabAllowed = tab === 'dashboard' || tab === 'billing' || allowedModules.includes(tab);

  if (!isTabAllowed) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="max-w-lg w-full text-center py-16 px-8 bg-slate-900/60 border border-slate-800/80 rounded-3xl space-y-6">
          <h2 className="text-2xl font-extrabold text-white capitalize">{tab} Locked</h2>
          <p className="text-slate-400">Upgrade your plan to access this ERP module.</p>
        </div>
      </div>
    );
  }

  // Server Actions
  async function addAccountAction(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const groupId = formData.get('groupId') as string;
    const balanceType = formData.get('balanceType') as string;
    const openingBalance = parseFloat(formData.get('openingBalance') as string) || 0;
    
    if (!name || !groupId) return;

    if (!allowedModules.includes('chart-of-accounts')) {
      redirect(`/tenant/${subdomain}?tab=${tab}&error=Module+locked.+Upgrade+plan.`);
    }

    const tDb = await getTenantDb(subdomain);
    const count = await tDb.account.count();
    if (count >= (planConfig?.maxLedgers || 50)) {
      redirect(`/tenant/${subdomain}?tab=chart-of-accounts&error=Limit+reached.+Max+${planConfig?.maxLedgers || 50}+ledgers+allowed.`);
    }

    await tDb.account.create({
      data: { name, groupId, balanceType, openingBalance }
    });
    revalidatePath(`/tenant/${subdomain}`);
    redirect(`/tenant/${subdomain}?tab=chart-of-accounts&success=account`);
  }

  async function addItemAction(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const uom = formData.get('uom') as string;
    const openingStock = parseFloat(formData.get('openingStock') as string) || 0;
    const openingRate = parseFloat(formData.get('openingRate') as string) || 0;
    
    if (!name || !uom) return;

    if (!allowedModules.includes('items')) {
      redirect(`/tenant/${subdomain}?tab=${tab}&error=Module+locked.+Upgrade+plan.`);
    }

    const tDb = await getTenantDb(subdomain);
    const count = await tDb.item.count();
    const maxItems = planConfig?.maxLedgers || 50;
    if (count >= maxItems) {
      redirect(`/tenant/${subdomain}?tab=items&error=Limit+reached.+Max+${maxItems}+items+allowed.`);
    }

    await tDb.item.create({
      data: { name, uom, openingStock, openingRate }
    });
    revalidatePath(`/tenant/${subdomain}`);
    redirect(`/tenant/${subdomain}?tab=items&success=item`);
  }

  async function addSalesVoucherAction(formData: FormData) {
    'use server';
    const voucherNumber = formData.get('voucherNumber') as string;
    const customerAccountId = formData.get('customerAccountId') as string;
    const salesAccountId = formData.get('salesAccountId') as string;
    const itemId = formData.get('itemId') as string;
    const quantity = parseFloat(formData.get('quantity') as string) || 0;
    const rate = parseFloat(formData.get('rate') as string) || 0;
    
    if (!voucherNumber || !customerAccountId || !salesAccountId || !itemId || !quantity || !rate) return;
    
    if (!allowedModules.includes('vouchers')) {
      redirect(`/tenant/${subdomain}?tab=${tab}&error=Module+locked.+Upgrade+plan.`);
    }

    const amount = quantity * rate;

    await createVoucher(subdomain, {
      voucherNumber,
      date: new Date(),
      type: 'Sales',
      narration: `Sales of ${quantity} items`,
      entries: [
        { accountId: customerAccountId, amount: amount, type: 'DEBIT' }, // Debtor increases
        { accountId: salesAccountId, amount: amount, type: 'CREDIT' }    // Income increases
      ],
      inventoryEntries: [
        { itemId: itemId, quantity: -quantity, rate, amount } // Negative quantity for outward
      ]
    });

    revalidatePath(`/tenant/${subdomain}`);
    redirect(`/tenant/${subdomain}?tab=vouchers&success=voucher`);
  }

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <SuccessToast />
      <ErrorToast />

      {/* ═══ DASHBOARD ═══════════════════════════════════════════════════════════ */}
      {tab === 'dashboard' && (
        <>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight capitalize">
              {subdomain} ERP Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Financial and Inventory Overview
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 md:gap-5">
            <StatCard label="Total Accounts" value={String(accounts.length)} sub="In Chart of Accounts" accent="bg-indigo-500/20" />
            <StatCard label="Total Items" value={String(items.length)} sub="In Inventory" accent="bg-purple-500/20" />
            <StatCard label="Transactions" value={String(vouchers.length)} sub="Recorded Vouchers" accent="bg-emerald-500/20" />
            <StatCard label="Plan" value={subscriptionPlanCode} sub="Current Subscription" accent="bg-amber-500/20" />
          </div>

          {planConfig?.analytics && (
            <DashboardAnalytics subdomain={subdomain} vouchers={vouchers} />
          )}
        </>
      )}

      {/* ═══ CHART OF ACCOUNTS ═══════════════════════════════════════════════════════════ */}
      {tab === 'chart-of-accounts' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <SectionHeader title="Chart of Accounts" subtitle="Manage all your financial ledgers and groups." />
            <DataTable empty={accounts.length === 0} head={
              <><th className="py-3.5 px-5">Account Name</th><th className="py-3.5 px-5">Group</th><th className="py-3.5 px-5 text-right">Opening Bal</th></>
            }>
              {accounts.map((acc: any) => (
                <tr key={acc.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="py-4 px-5 font-semibold text-white">{acc.name}</td>
                  <td className="py-4 px-5 text-slate-400">{acc.group.name}</td>
                  <td className="py-4 px-5 text-right font-mono text-sm text-slate-300">
                    ₹{acc.openingBalance.toLocaleString('en-IN')} {acc.balanceType === 'CREDIT' ? 'Cr' : 'Dr'}
                  </td>
                </tr>
              ))}
            </DataTable>
          </div>
          <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6 h-fit space-y-5">
            <h3 className="font-bold text-white text-lg">Add New Account</h3>
            <form action={addAccountAction} className="space-y-4">
              <Field label="Account Name">
                <input type="text" name="name" required placeholder="e.g. Sales Account, HDFC Bank" className={inputCls} />
              </Field>
              <Field label="Account Group">
                <select name="groupId" required className={inputCls + ' appearance-none'}>
                  <option value="" disabled>Select group...</option>
                  {accountGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Opening Bal (₹)">
                  <input type="number" name="openingBalance" step="0.01" defaultValue="0" className={inputCls} />
                </Field>
                <Field label="Bal Type">
                  <select name="balanceType" className={inputCls + ' appearance-none'}>
                    <option value="DEBIT">Dr (Asset/Exp)</option>
                    <option value="CREDIT">Cr (Liab/Inc)</option>
                  </select>
                </Field>
              </div>
              <SubmitButton className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">+ Create Account</SubmitButton>
            </form>
          </div>
        </div>
      )}

      {/* ═══ ITEMS ═══════════════════════════════════════════════════════════ */}
      {tab === 'items' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <SectionHeader title="Inventory Items" subtitle="Manage stock items and opening balances." />
            <DataTable empty={items.length === 0} head={
              <><th className="py-3.5 px-5">Item Name</th><th className="py-3.5 px-5">UOM</th><th className="py-3.5 px-5 text-right">Opening Stock</th><th className="py-3.5 px-5 text-right">Rate</th></>
            }>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="py-4 px-5 font-semibold text-white">{item.name}</td>
                  <td className="py-4 px-5 text-slate-400">{item.uom}</td>
                  <td className="py-4 px-5 text-right font-mono text-sm text-emerald-400">{item.openingStock}</td>
                  <td className="py-4 px-5 text-right font-mono text-sm text-slate-300">₹{item.openingRate.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </DataTable>
          </div>
          <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6 h-fit space-y-5">
            <h3 className="font-bold text-white text-lg">Add New Item</h3>
            <form action={addItemAction} className="space-y-4">
              <Field label="Item Name">
                <input type="text" name="name" required placeholder="e.g. MacBook Pro" className={inputCls} />
              </Field>
              <Field label="Unit of Measure (UOM)">
                <input type="text" name="uom" required placeholder="e.g. Pcs, Kgs" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Opening Stock">
                  <input type="number" name="openingStock" step="0.01" defaultValue="0" className={inputCls} />
                </Field>
                <Field label="Opening Rate (₹)">
                  <input type="number" name="openingRate" step="0.01" defaultValue="0" className={inputCls} />
                </Field>
              </div>
              <SubmitButton className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">+ Create Item</SubmitButton>
            </form>
          </div>
        </div>
      )}

      {/* ═══ VOUCHERS ═══════════════════════════════════════════════════════════ */}
      {tab === 'vouchers' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <SectionHeader title="Daybook / Vouchers" subtitle="Record of all transactions." />
            <DataTable empty={vouchers.length === 0} head={
              <><th className="py-3.5 px-5">Voucher #</th><th className="py-3.5 px-5">Type</th><th className="py-3.5 px-5">Date</th></>
            }>
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-indigo-400">{v.voucherNumber}</td>
                  <td className="py-4 px-5 text-white">{v.type}</td>
                  <td className="py-4 px-5 text-slate-400">{new Date(v.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </DataTable>
          </div>
          <div className="bg-slate-900 border border-slate-800/70 rounded-2xl p-6 h-fit space-y-5">
            <h3 className="font-bold text-white text-lg">Record Sales Voucher</h3>
            <p className="text-xs text-slate-400">Creates a double-entry transaction & updates stock.</p>
            <form action={addSalesVoucherAction} className="space-y-4">
              <Field label="Voucher Number">
                <input type="text" name="voucherNumber" required placeholder="SALES-001" className={inputCls} />
              </Field>
              <Field label="Customer Account (Dr)">
                <select name="customerAccountId" required className={inputCls + ' appearance-none'}>
                  <option value="" disabled>Select Debtor...</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </Field>
              <Field label="Sales Account (Cr)">
                <select name="salesAccountId" required className={inputCls + ' appearance-none'}>
                  <option value="" disabled>Select Sales Account...</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </Field>
              <Field label="Item Sold">
                <select name="itemId" required className={inputCls + ' appearance-none'}>
                  <option value="" disabled>Select Item...</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Quantity">
                  <input type="number" name="quantity" step="0.01" required className={inputCls} />
                </Field>
                <Field label="Rate (₹)">
                  <input type="number" name="rate" step="0.01" required className={inputCls} />
                </Field>
              </div>
              <SubmitButton className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">Record Sale</SubmitButton>
            </form>
          </div>
        </div>
      )}

      {/* ═══ REPORTS ═══════════════════════════════════════════════════════════ */}
      {tab === 'reports' && (
        <div className="space-y-8">
          <SectionHeader title="Financial Reports" subtitle="Real-time Trial Balance and Stock Summary." />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg">Trial Balance</h3>
              <div className="bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-500 text-[11px] font-bold uppercase">
                      <th className="py-3 px-4">Account</th>
                      <th className="py-3 px-4 text-right">Debit Balance</th>
                      <th className="py-3 px-4 text-right">Credit Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {/* Trial Balance is fetched dynamically on render */}
                    {(await getTrialBalance(subdomain)).map(acc => {
                      const isDr = acc.balanceType === 'DEBIT' && acc.balance >= 0 || acc.balanceType === 'CREDIT' && acc.balance < 0;
                      const bal = Math.abs(acc.balance);
                      return (
                        <tr key={acc.accountId} className="hover:bg-slate-800/30 transition-all text-white">
                          <td className="py-3 px-4">
                            <span className="font-medium">{acc.accountName}</span>
                            <span className="block text-[10px] text-slate-500">{acc.groupName}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-emerald-400">{isDr && bal > 0 ? `₹${bal.toLocaleString('en-IN')}` : '-'}</td>
                          <td className="py-3 px-4 text-right font-mono text-pink-400">{!isDr && bal > 0 ? `₹${bal.toLocaleString('en-IN')}` : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg">Stock Summary</h3>
              <div className="bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-500 text-[11px] font-bold uppercase">
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4 text-right">Current Stock</th>
                      <th className="py-3 px-4 text-right">Valuation (Avg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {(await getInventoryValuation(subdomain)).map(item => (
                      <tr key={item.itemId} className="hover:bg-slate-800/30 transition-all text-white">
                        <td className="py-3 px-4 font-medium">{item.itemName}</td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-400">
                          {item.currentStock} <span className="text-[10px] text-slate-500 ml-1">{item.uom}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-300">₹{Math.round(item.stockValue).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'billing' && <BillingPanel currentPlan={subscriptionPlanCode} country={org.country} />}
    </div>
  );
}
