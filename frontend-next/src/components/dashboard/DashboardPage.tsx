"use client";

import OrderList from "@/components/dashboard/OrderList";
import { Order, Route, Vehicle } from "@/lib/types";
import { fetchOrders, fetchVehicles, fetchRoutes, optimizeRoutes } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { Zap, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import clsx from "clsx";

const Map = dynamic(() => import("@/components/dashboard/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
      Loading Map...
    </div>
  ),
});

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [mobileView, setMobileView] = useState<"orders" | "map">("orders");
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);

  const liveRefreshMs = 15000;

  const loadData = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    try {
      if (!silent) {
        setLoading(true);
      }
      const [orderData, vehicleData, routeData] = await Promise.all([
        fetchOrders(),
        fetchVehicles(),
        fetchRoutes(),
      ]);
      setOrders(orderData);
      setVehicles(vehicleData);
      setRoutes(routeData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load orders:", error);
      if (!silent) {
        alert("Error connecting to backend.");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    loadData();

    return () => window.removeEventListener("resize", checkMobile);
  }, [loadData]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadData({ silent: true });
    }, liveRefreshMs);

    return () => window.clearInterval(intervalId);
  }, [loadData, liveRefreshMs]);

  // Detect token changes (new user logged in) and reload all data
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('gl_token') : null;
    
    if (token && token !== currentToken) {
      setCurrentToken(token);
      // Clear previous user's data when token changes
      setOrders([]);
      setVehicles([]);
      setRoutes([]);
      setLastUpdated(null);
      // Reload with new token
      loadData();
    }
  }, [currentToken, loadData]);

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      console.log("Starting Optimization...");

      const optimizedRoutes = await optimizeRoutes();
      console.log("=== OPTIMIZE RESPONSE ===");
      console.log("Full response:", JSON.stringify(optimizedRoutes, null, 2));
      console.log("Number of routes:", optimizedRoutes.length);

      if (optimizedRoutes.length > 0) {
        console.log("First route structure:", optimizedRoutes[0]);
        console.log("First route stops:", optimizedRoutes[0].stops);
        console.log("First route orders:", optimizedRoutes[0].orders);
      }

      setRoutes(optimizedRoutes);

      const allStops = optimizedRoutes.flatMap((route) => route.stops || route.orders || []);
      console.log("All stops extracted:", allStops);
      console.log("Number of stops:", allStops.length);

      const assignedIds = new Set(
        allStops
          .map((stop) => {
            if (!stop) return null;
            if (typeof stop === "string") {
              console.log("Stop is string:", stop);
              return stop;
            }
            if (typeof stop === "object") {
              const id = "id" in stop && stop.id ? String(stop.id) : null;
              const orderId = "orderId" in stop && stop.orderId ? String(stop.orderId) : null;
              console.log("Stop is object:", stop, "-> id:", id || orderId);
              return id || orderId;
            }
            return null;
          })
          .filter((id): id is string => Boolean(id))
      );
      console.log("Assigned IDs:", Array.from(assignedIds));
      console.log("Assigned IDs count:", assignedIds.size);
      console.log("Current order IDs:", orders.map((order) => order.id));

      setOrders((prevOrders) => {
        const updated = prevOrders.map((order) => {
          const isAssigned = assignedIds.has(String(order.id));
          if (isAssigned) {
            console.log(`Order ${order.id} is ASSIGNED`);
            return { ...order, status: "ASSIGNED" as const };
          }
          return order;
        });
        console.log("Updated orders:", updated);
        return updated;
      });

      alert(`Optimization Successful! Created ${optimizedRoutes.length} routes.`);
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Optimization failed. Check console.");
    } finally {
      setOptimizing(false);
    }
  };

  const totalOrders = orders.length;
  const assignedOrders = orders.filter((order) => order.status === "ASSIGNED").length;
  const deliveredOrders = orders.filter((order) => order.status === "DELIVERED").length;
  const unassignedOrders = totalOrders - assignedOrders - deliveredOrders;
  const availableVehicles = vehicles.filter((vehicle) => (vehicle.status || "AVAILABLE") === "AVAILABLE").length;
  const inTransitVehicles = vehicles.filter((vehicle) => vehicle.status === "IN_TRANSIT").length;

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Dispatcher Dashboard</h1>
          <p className="text-sm text-slate-500 sm:text-base">Overview of active routes and orders</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <button
            onClick={() => loadData()}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 sm:w-auto"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium shadow-sm transition-colors text-white ${
              optimizing ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            <Zap size={18} className={optimizing ? "animate-pulse" : ""} />
            {optimizing ? "Optimizing..." : "Optimize Routes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4 xl:grid-cols-6">
        <div className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Orders</p>
          <p className="text-2xl font-semibold text-slate-900">{totalOrders}</p>
        </div>
        <div className="space-y-1 rounded-lg border border-amber-100 bg-amber-50 p-3">
          <p className="text-xs uppercase tracking-wide text-amber-600">Unassigned</p>
          <p className="text-2xl font-semibold text-amber-900">{unassignedOrders}</p>
        </div>
        <div className="space-y-1 rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs uppercase tracking-wide text-blue-600">Assigned</p>
          <p className="text-2xl font-semibold text-blue-900">{assignedOrders}</p>
        </div>
        <div className="space-y-1 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
          <p className="text-xs uppercase tracking-wide text-emerald-600">Delivered</p>
          <p className="text-2xl font-semibold text-emerald-900">{deliveredOrders}</p>
        </div>
        <div className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Vehicles Ready</p>
          <p className="text-2xl font-semibold text-slate-900">{availableVehicles}</p>
        </div>
        <div className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">In Transit</p>
          <p className="text-2xl font-semibold text-slate-900">{inTransitVehicles}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
          Live updates every {Math.round(liveRefreshMs / 1000)}s
        </span>
        <span>
          {lastUpdated
            ? `Last refreshed ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "Waiting for first refresh"}
        </span>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">
        <div
          className={clsx(
            "lg:col-span-1 h-[65vh] sm:h-[70vh] md:h-full",
            mobileView === "orders" ? "block" : "hidden",
            "md:block"
          )}
        >
          {loading ? (
            <div className="h-full flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400">
              Loading Orders...
            </div>
          ) : (
            <OrderList orders={orders} />
          )}
        </div>
        <div
          className={clsx(
            "lg:col-span-2 h-[65vh] sm:h-[70vh] md:h-full bg-white rounded-lg shadow-sm border border-slate-200",
            mobileView === "map" ? "block" : "hidden",
            "md:block"
          )}
        >
          {isClient && (mobileView === "map" || !isMobile) ? (
            <Map orders={orders} routes={routes} vehicles={vehicles} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
