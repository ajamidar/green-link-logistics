import math

def calculate_distance(lat1, lon1, lat2, lon2):
    # Radius of the Earth in km
    R = 6371.0
    
    # Convert latitude and longitude from degrees to radians
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    # The Haversine Formula
    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return distance

def solve_vrp(orders, vehicles):
    # 1. Start at the Depot (We'll assume a fixed location for now, e.g., New York)
    current_lat = 40.7128
    current_lon = -74.0060
    
    # 2. The Simple "Greedy" Algorithm:
    # Always go to the nearest order that hasn't been visited yet.
    
    route = []
    unvisited = orders.copy()
    
    while unvisited:
        nearest_order = None
        min_dist = float('inf')
        
        # Find the closest order to where the truck currently is
        for order in unvisited:
            dist = calculate_distance(current_lat, current_lon, order['latitude'], order['longitude'])
            
            if dist < min_dist:
                min_dist = dist
                nearest_order = order
        
        # "Drive" the truck to that order
        if nearest_order:
            route.append(nearest_order)
            unvisited.remove(nearest_order)
            # Update truck location to the new spot
            current_lat = nearest_order['latitude']
            current_lon = nearest_order['longitude']
            
    return route