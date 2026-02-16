export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
  /\/+$/,
  "",
);

export const endpoints = {
  list: `${apiBaseUrl}/api/v1/clinical-images`,
  create: `${apiBaseUrl}/api/v1/clinical-images`,
  update: (id: number) => `${apiBaseUrl}/api/v1/clinical-images/${id}`,
  delete: (id: number) => `${apiBaseUrl}/api/v1/clinical-images/${id}`,
};
