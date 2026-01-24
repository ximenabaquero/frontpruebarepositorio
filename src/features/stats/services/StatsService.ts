export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "/backend";

export const endpoints = {
  summary: `${apiBaseUrl}/api/v1/stats/summary`,
  monthlyIncome: `${apiBaseUrl}/api/v1/stats/income-monthly`,
  weeklyIncome: `${apiBaseUrl}/api/v1/stats/income-weekly`,
  referrerStats: `${apiBaseUrl}/api/v1/stats/referrer-stats`,
  topProcedures: `${apiBaseUrl}/api/v1/stats/top-procedures`,
  incomeByProcedure: `${apiBaseUrl}/api/v1/stats/income-by-procedure`,
};
