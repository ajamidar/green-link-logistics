"use client";

import OrderList from "@/components/dashboard/OrderList";
import { Order, Route } from "@/lib/types";
import { fetchOrders, optimizeRoutes } from "@/lib/api"; // Import our API functions
import { useState, useEffect } from "react";
import { Zap, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import clsx from "clsx";

// Dynamic Import for Map (No SSR)
const Map = dynamic(() => import("@/components/dashboard/Map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
});

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [mobileView, setMobileView] = useState<"orders" | "map">("orders");

  // 1. FETCH DATA ON LOAD
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders(); // Calls Java: GET /api/orders
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      alert("Error connecting to backend. Is Java running on port 8080?");
    } finally {
      setLoading(false);
    }
  };

  // 2. HANDLE OPTIMIZATION
  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      await optimizeRoutes(); // Calls Java: POST /api/routes/optimize
      alert("Optimization Successful! Routes created.");
      await loadData(); // Reload to see the new status (ASSIGNED)
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Optimization failed. Check console for details.");
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]"> 
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Dispatcher Dashboard</h1>
          <p className="text-sm text-slate-500 sm:text-base">Overview of active routes and orders</p>
        </div>
        
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            {/* Refresh Button */}
            <button 
                onClick={loadData}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 sm:w-auto"
                title="Refresh Data"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                <span className="text-sm font-medium sm:hidden">Refresh</span>
            </button>

            {/* Optimize Button */}
            <button 
                onClick={handleOptimize}
                disabled={optimizing}
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium shadow-sm transition-colors text-white
                    ${optimizing ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}
                `}
            >
            <Zap size={18} className={optimizing ? "animate-pulse" : ""} />
            {optimizing ? "Optimizing..." : "Optimize Routes"}
            </button>
        </div>
      </div>

      {/* Mobile Toggle */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm md:hidden">
        <button
          onClick={() => setMobileView("orders")}
          className={clsx(
            "flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
            mobileView === "orders" ? "bg-slate-900 text-white" : "text-slate-600"
          )}
        >
          Orders
        </button>
        <button
          onClick={() => setMobileView("map")}
          className={clsx(
            "flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
            mobileView === "map" ? "bg-slate-900 text-white" : "text-slate-600"
          )}
        >
          Map
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">
        
        {/* Order List */}
        <div
          className={clsx(
            "lg:col-span-1 h-[65vh] sm:h-[70vh] md:h-full",
            mobileView === "orders" ? "block" : "hidden",
            "md:block"
          )}
        >
          {loading ? (
             <div className="h-full flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400">Loading Orders...</div>
          ) : (
             <OrderList orders={orders} />
          )}
        </div>

        {/* Map */}
        <div
          className={clsx(
            "lg:col-span-2 h-[65vh] sm:h-[70vh] md:h-full bg-white rounded-lg shadow-sm border border-slate-200",
            mobileView === "map" ? "block" : "hidden",
            "md:block"
          )}
        >
           <Map orders={orders} />
        </div>

      </div>
    </div>
  );
}