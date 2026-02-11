package com.greenlink.controller;

import com.greenlink.model.Vehicle;
import com.greenlink.repository.VehicleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    // Dependency Injection: Spring gives us the repository automatically
    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    // GET /api/vehicles - List all vehicles
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // POST /api/vehicles - Create a new vehicle
    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        // Hardcode a fake Organization ID for now (simulating a logged-in user)
        if (vehicle.getOrganizationId() == null) {
            // We use a fixed UUID so all your test data belongs to the same "company"
            vehicle.setOrganizationId(UUID.fromString("11111111-1111-1111-1111-111111111111"));
        }
        return vehicleRepository.save(vehicle);
    }
}