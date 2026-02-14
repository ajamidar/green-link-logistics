// src/components/dashboard/Map.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Order } from "@/lib/types";
import L from "leaflet";

// Render markers as CSS shapes to avoid external image loading issues.
const createIcon = (color: string) => {
  const html = `
    <div style="
      width: 22px;
      height: 22px;
      background: ${color};
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
    "></div>
  `;

  return L.divIcon({
    className: "",
    html,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

// Define the specific icons we need
const icons = {
  UNASSIGNED: createIcon("#ef4444"),
  ASSIGNED: createIcon("#22c55e"),
};

interface MapProps {
  orders: Order[];
}

export default function Map({ orders }: MapProps) {
  // Default Center: New York City
  const defaultCenter: [number, number] = [40.7128, -74.0060];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-slate-300 shadow-sm relative z-0">
      <div className="absolute left-3 bottom-3 z-[1000] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
          <span>Unassigned Order</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
          <span>Assigned Order</span>
        </div>
      </div>
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* The Map Tiles (Skin) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Order Markers */}
        {orders.map((order) => (
          <Marker 
            key={order.id} 
            position={[order.latitude, order.longitude]}
            // Select the icon based on status
            icon={order.status === "ASSIGNED" ? icons.ASSIGNED : icons.UNASSIGNED}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">Order #{order.id.substring(0, 6)}</p>
                <p>Weight: {order.weightKg}kg</p>
                <p>Status: {order.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}