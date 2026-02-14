import axios from "axios";
import { Order, Route, Vehicle } from "./types";

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom API Functions 

export const fetchVehicles = async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>('/vehicles');
    return response.data;
};

export const fetchOrders = async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
};

export const fetchRoutes = async (): Promise<Route[]> => {
    // Lets assume I have a GET /api/routes endpoint. 
    // If not, I can create one in Java later, or just return empty for now.
    try {
        const response = await apiClient.get<Route[]>('/routes');
        return response.data;
    } catch (error) {
        console.warn("Could not fetch routes", error);
        return [];
    }
};

export const optimizeRoutes = async (): Promise<Route[]> => {
    //Trigger Python solver via Java endpoint.
    const response = await apiClient.post<Route[]>('/routes/optimize');
    return response.data;
};