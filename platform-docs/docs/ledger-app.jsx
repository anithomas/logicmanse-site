import { useState, useMemo } from "react";
import { Plus, Trash2, Download, TrendingUp, TrendingDown, Receipt } from "lucide-react";

const CATEGORIES = [
  "Sales / Revenue",
  "Supplies",
  "Software & Subscriptions",
  "Professional Fees",
  "Travel",
  "Meals & Entertainment",
  "Rent & Utilities",
  "Other",
];

const INK = "#1B2A3A";
const PARCHMENT = "#FAF6EE";
const SAGE = "#5B7A63";
const RUST = "#A6482F";
const GOLD = "#C9A45C";
const MUTE = "#8B8578";

function currency(n) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function LedgerApp() {
  const [entries, setEntries] = useState([
    { id: 1, date: todayISO(), vendor: "Opening balance", category: "Other", type: "income", amount: 0, hst: false },
  ]);
  const [form, setForm] = useState({
    date: todayISO(),
    vendor: "",
    category: CATEGORIES[0],
    type: "expense",
    amount: "",
    hst: false,
  });

  const totals = useMemo(() => {
    let income = 0, expense = 0, hstCollected = 0, hstPaid = 0;
    for (const e of entries) {
      const amt = Number(e.amount) || 0;
      if (e.type === "income") {
        income += amt;
        if (e.hst) hstCollected += amt - amt / 1.13;
      } else {
        expense += amt;
        if (e.hst) hstPaid += amt - amt / 1.13;
      }
    }
    return { income, expense, net: income - expense, hstCollected, hstPaid, hstOwing: hstCollected - hstPaid };
  }, [entries]);

  const byCategory = useMemo(() => {
    const map = {};
    for (const e of entries) {
      if (e.type !== "expense") continue;
      map[e.category] = (map[e.category] || 0) + (Number(e.amount) || 0);
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  function addEntry() {
    if (!form.vendor.trim() || !form.amount) return;
    setEntries((prev) => [
      { id: Date.now(), ...form, amount: Number(form.amount) },
      ...prev,
    ]);
    setForm((f) => ({ ...f, vendor: "", amount: "" }));
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function exportCSV() {
    const header = "Date,Vendor,Category,Type,Amount,HST Included\n";
    const rows = entries
      .map((e) => `${e.date},"${e.vendor}",${e.category},${e.type},${e.amount},${e.hst ? "yes" : "no"}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ledger-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif" }} className="p-4 sm:p-8">
      {/* Ledger tape header */}
      <div style={{ background: INK }} className="rounded-lg px-5 py-4 mb-6 flex items-center justify-between">
        <div>
          <div style={{ color: GOLD, fontFamily: "ui-sans-serif, system-ui" }} className="text-xs tracking-widest uppercase mb-1">
            Running Balance
          </div>
          <div
            style={{ color: totals.net >= 0 ? "#DCE8DF" : "#F0D3C9", fontFamily: "ui-monospace, monospace" }}
            className="text-3xl font-bold"
          >
            {currency(totals.net)}
          </div>
        </div>
        <button
          onClick={exportCSV}
          style={{ fontFamily: "ui-sans-serif, system-ui" }}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-2 rounded-md transition"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-3 border" style={{ borderColor: "#E5DFD0" }}>
          <div style={{ color: SAGE, fontFamily: "ui-sans-serif, system-ui" }} className="flex items-center gap-1 text-xs uppercase tracking-wide mb-1">
            <TrendingUp size={13} /> Income
          </div>
          <div style={{ fontFamily: "ui-monospace, monospace" }} className="text-lg font-semibold" >{currency(totals.income)}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border" style={{ borderColor: "#E5DFD0" }}>
          <div style={{ color: RUST, fontFamily: "ui-sans-serif, system-ui" }} className="flex items-center gap-1 text-xs uppercase tracking-wide mb-1">
            <TrendingDown size={13} /> Expenses
          </div>
          <div style={{ fontFamily: "ui-monospace, monospace" }} className="text-lg font-semibold">{currency(totals.expense)}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border" style={{ borderColor: "#E5DFD0" }}>
          <div style={{ color: GOLD, fontFamily: "ui-sans-serif, system-ui" }} className="flex items-center gap-1 text-xs uppercase tracking-wide mb-1">
            <Receipt size={13} /> HST Owing
          </div>
          <div style={{ fontFamily: "ui-monospace, monospace" }} className="text-lg font-semibold">{currency(totals.hstOwing)}</div>
        </div>
      </div>

      {/* Entry form */}
      <div className="bg-white rounded-lg p-4 mb-6 border" style={{ borderColor: "#E5DFD0", fontFamily: "ui-sans-serif, system-ui" }}>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="col-span-2 sm:col-span-1 border rounded-md px-2 py-2 text-sm"
            style={{ borderColor: "#D8D1BF" }}
          />
          <input
            type="text"
            placeholder="Vendor / description"
            value={form.vendor}
            onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))}
            className="col-span-2 border rounded-md px-2 py-2 text-sm"
            style={{ borderColor: "#D8D1BF" }}
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="col-span-2 sm:col-span-1 border rounded-md px-2 py-2 text-sm"
            style={{ borderColor: "#D8D1BF" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="border rounded-md px-2 py-2 text-sm"
            style={{ borderColor: "#D8D1BF" }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="border rounded-md px-2 py-2 text-sm"
            style={{ borderColor: "#D8D1BF" }}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm" style={{ color: MUTE }}>
            <input
              type="checkbox"
              checked={form.hst}
              onChange={(e) => setForm((f) => ({ ...f, hst: e.target.checked }))}
            />
            Includes HST (13%)
          </label>
          <button
            onClick={addEntry}
            style={{ background: INK }}
            className="flex items-center gap-1 text-white text-sm px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {/* Ledger list */}
        <div className="sm:col-span-2 bg-white rounded-lg border overflow-hidden" style={{ borderColor: "#E5DFD0" }}>
          <div style={{ fontFamily: "ui-sans-serif, system-ui", color: MUTE }} className="text-xs uppercase tracking-wide px-4 py-2 border-b" >
            Ledger
          </div>
          <div className="divide-y" style={{ borderColor: "#EFE9DC" }}>
            {entries.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-4 py-2 text-sm">
                <div>
                  <div style={{ fontFamily: "ui-sans-serif, system-ui" }} className="font-medium">{e.vendor}</div>
                  <div style={{ color: MUTE, fontFamily: "ui-sans-serif, system-ui" }} className="text-xs">
                    {e.date} · {e.category}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    style={{ color: e.type === "income" ? SAGE : RUST, fontFamily: "ui-monospace, monospace" }}
                    className="font-semibold"
                  >
                    {e.type === "income" ? "+" : "−"}
                    {currency(Number(e.amount))}
                  </span>
                  <button onClick={() => removeEntry(e.id)} style={{ color: MUTE }} className="hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-lg border p-4" style={{ borderColor: "#E5DFD0", fontFamily: "ui-sans-serif, system-ui" }}>
          <div style={{ color: MUTE }} className="text-xs uppercase tracking-wide mb-3">Expenses by Category</div>
          {byCategory.length === 0 && <div style={{ color: MUTE }} className="text-sm">No expenses yet.</div>}
          {byCategory.map(([cat, amt]) => (
            <div key={cat} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{cat}</span>
                <span style={{ fontFamily: "ui-monospace, monospace" }}>{currency(amt)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full"
                  style={{ background: RUST, width: `${Math.min(100, (amt / (totals.expense || 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
