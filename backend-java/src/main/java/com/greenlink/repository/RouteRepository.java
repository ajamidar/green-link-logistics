package com.greenlink.repository;

import com.greenlink.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RouteRepository extends JpaRepository<Route, UUID> {
    // We will add custom queries here later (e.g., findByVehicleId)
}