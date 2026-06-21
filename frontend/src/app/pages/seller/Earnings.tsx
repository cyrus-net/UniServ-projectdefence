import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react";
import { api } from "../../services/api";

export function Earnings() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.services.getStats(),
          api.bookings.getRecentForSeller(),
        ]);

        setTotalEarnings(statsRes.totalEarnings || 0);
        
        // Process bookings into transactions
        const bookingList = Array.isArray(bookingsRes) ? bookingsRes : [];
        const txns = bookingList.map((booking: any) => {
          const servicePrice = booking.service?.price || 0;
          return {
            id: booking._id,
            type: "Order",
            description: booking.service?.title || "Service",
            amount: booking.paymentStatus === "paid" ? servicePrice : 0,
            date: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "",
            status: booking.paymentStatus === "paid" ? "Completed" : "Pending",
          };
        });

        setTransactions(txns);

        // Calculate monthly and pending
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyTotal = txns
          .filter(tx => {
            const txDate = new Date(tx.date);
            return txDate >= monthStart && tx.status === "Completed";
          })
          .reduce((sum, tx) => sum + tx.amount, 0);

        const pendingTotal = txns
          .filter(tx => tx.status !== "Completed")
          .reduce((sum, tx) => sum + tx.amount, 0);

        setMonthlyEarnings(monthlyTotal);
        setPendingEarnings(pendingTotal);
        setAvailableBalance(statsRes.totalEarnings || 0);
      } catch (error) {
        console.error("Failed to load earnings data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-foreground/70">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Earnings</h1>
          <p className="text-foreground/70">Track your income and transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground/60">Available Balance</p>
            </div>
            <p className="text-3xl font-bold">₦{availableBalance.toFixed(2)}</p>
            <button className="mt-3 text-sm text-primary hover:text-primary/80 font-medium">
              Withdraw
            </button>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-foreground/60">This Month</p>
            </div>
            <p className="text-3xl font-bold">₦{monthlyEarnings.toFixed(2)}</p>
            <p className="mt-1 text-sm text-green-600">From completed orders</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-foreground/60">Total Earnings</p>
            </div>
            <p className="text-3xl font-bold">₦{totalEarnings.toFixed(2)}</p>
            <p className="mt-1 text-sm text-foreground/60">All time</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-sm text-foreground/60">Pending</p>
            </div>
            <p className="text-3xl font-bold">₦{pendingEarnings.toFixed(2)}</p>
            <p className="mt-1 text-sm text-foreground/60">In progress orders</p>
          </div>
        </div>

        {/* Earnings Chart Placeholder */}
        <div className="bg-card rounded-xl p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Earnings Overview</h2>
            <select aria-label="Select earnings time period" className="px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-foreground/70">Earnings chart visualization</p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center text-foreground/70">
              No transactions yet. Complete your first booking to see earnings.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Description</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-foreground/70">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === "Order" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{transaction.description}</td>
                      <td className="px-6 py-4 text-foreground/70">{transaction.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          transaction.status === "Completed" ? "text-green-600" : "text-yellow-600"
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${
                        transaction.amount > 0 ? "text-green-600" : "text-foreground"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}₦{Math.abs(transaction.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
