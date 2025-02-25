// lib/api.ts
export const apiRequest = async (endpoint: string, method = 'GET', body?: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : null,
    });
    return res.json();
  };
  