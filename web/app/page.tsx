import { BudgetProvider } from "@/components/budget-provider";
import { BudgetDashboard } from "@/components/budget-dashboard";

export default function Home() {
  return (
    <BudgetProvider>
      <BudgetDashboard />
    </BudgetProvider>
  );
}
