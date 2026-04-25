export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
  /\/+$/,
  "",
);

export const endpoints = {
  summary: `${apiBaseUrl}/api/v1/stats/summary`,
  referrerStats: `${apiBaseUrl}/api/v1/stats/referrer-stats`,
  topByDemand: `${apiBaseUrl}/api/v1/stats/procedures/top-demand`,
  topByIncome: `${apiBaseUrl}/api/v1/stats/procedures/top-income`,
  conversionRate: `${apiBaseUrl}/api/v1/stats/conversion-rate`,
  annualComparison: `${apiBaseUrl}/api/v1/stats/annual-comparison`,
  monthComparison: `${apiBaseUrl}/api/v1/stats/month-comparison`,

  patientsMonthly: `${apiBaseUrl}/api/v1/stats/patients-monthly`,
  incomeByProcedure: `${apiBaseUrl}/api/v1/stats/income-by-procedure`,
  monthlyIncome: `${apiBaseUrl}/api/v1/stats/income-monthly`,
  weeklyIncome: `${apiBaseUrl}/api/v1/stats/income-weekly`,

  revenueForecast: `${apiBaseUrl}/api/v1/stats/revenue-forecast?periods=3`,
  revenueTrend: `${apiBaseUrl}/api/v1/stats/revenue-trend`,
};
