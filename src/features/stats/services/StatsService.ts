export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "/backend";

export const endpoints = {
  summary: `${apiBaseUrl}/api/v1/stats/summary`,
  monthlyIncome: `${apiBaseUrl}/api/v1/stats/income-monthly`,
  weeklyIncome: `${apiBaseUrl}/api/v1/stats/income-weekly`,
  referrerStats: `${apiBaseUrl}/api/v1/stats/referrer-stats`,
  topByDemand: `${apiBaseUrl}/api/v1/stats/procedures/top-demand`,
  topByIncome: `${apiBaseUrl}/api/v1/stats/procedures/top-income`,
  incomeByProcedure: `${apiBaseUrl}/api/v1/stats/income-by-procedure`,
};
