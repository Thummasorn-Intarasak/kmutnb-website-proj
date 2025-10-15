"use client";

import { useState } from "react";
import { userApi, itemApi, bannerApi } from "../../lib/api-client";

export default function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApi = async (apiCall: () => Promise<any>, name: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiCall();
      setResult({ name, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">API Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => testApi(() => userApi.getAllUsers(), "Get All Users")}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Users API
        </button>

        <button
          onClick={() => testApi(() => itemApi.getAllItems(), "Get All Items")}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Items API
        </button>

        <button
          onClick={() =>
            testApi(() => bannerApi.getAllBanners(), "Get All Banners")
          }
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Banners API
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-black">Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold text-black text-lg mb-2">{result.name}</h3>
          <pre className="text-sm overflow-auto text-black max-h-96">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
