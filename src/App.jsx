import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { AppLayout } from "@/components/AppLayout";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import Transfer from "./pages/Transfer";
import MoneyForm from "./pages/MoneyForm";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Cards from "./pages/Cards";
import CardRequestForm from "./pages/CardRequestForm";
import CardRequests from "./pages/CardRequests";
import Loans from "./pages/Loans";
import LoanApply from "./pages/LoanApply";
import LoanRequests from "./pages/LoanRequests";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminCardRequests from "./pages/admin/AdminCardRequests";
import AdminLoanRequests from "./pages/admin/AdminLoanRequests";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminRoles from "./pages/admin/AdminRoles";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
});

function App() {
 return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/accounts/:id" element={<AccountDetail />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/deposit" element={<MoneyForm mode="deposit" />} />
              <Route path="/withdraw" element={<MoneyForm mode="withdraw" />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/:id" element={<TransactionDetail />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/cards/request" element={<CardRequestForm />} />
              <Route path="/cards/requests" element={<CardRequests />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/loans/apply" element={<LoanApply />} />
              <Route path="/loans/requests" element={<LoanRequests />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/admin/card-requests" element={<AdminRoute><AdminCardRequests /></AdminRoute>} />
              <Route path="/admin/loan-requests" element={<AdminRoute><AdminLoanRequests /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/accounts" element={<AdminRoute><AdminAccounts /></AdminRoute>} />
              <Route path="/admin/roles" element={<AdminRoute><AdminRoles /></AdminRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
 
};

export default App;
