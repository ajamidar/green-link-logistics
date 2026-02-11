from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import solver  # <--- Import our new mathematician

app = FastAPI()

# Define the "Shape" of the data we expect from Java
class Order(BaseModel):
    id: str
    latitude: float
    longitude: float
    weightKg: int

class Vehicle(BaseModel):
    id: str
    capacityKg: int

class OptimizationRequest(BaseModel):
    orders: List[Order]
    vehicles: List[Vehicle]

@app.get("/")
def health_check():
    return {"status": "active", "service": "GreenLink Optimization Engine"}

# The Main Endpoint
@app.post("/solve")
def solve_route(data: OptimizationRequest):
    # 1. Convert the incoming data to a list of dictionaries
    orders_data = [order.dict() for order in data.orders]
    vehicles_data = [vehicle.dict() for vehicle in data.vehicles]
    
    # 2. Call the solver
    sorted_route = solver.solve_vrp(orders_data, vehicles_data)
    
    # 3. Return the result
    return {"route": sorted_route}