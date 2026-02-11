package com.greenlink.controller;

import com.greenlink.model.DeliveryOrder;
import com.greenlink.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public List<DeliveryOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public DeliveryOrder createOrder(@RequestBody DeliveryOrder order) {
        // Safety check for Organization ID
        if (order.getOrganizationId() == null) {
            order.setOrganizationId(UUID.fromString("11111111-1111-1111-1111-111111111111"));
        }

        // Safety check for Status (The fix for your error)
        if (order.getStatus() == null) {
            order.setStatus("UNASSIGNED");
        }

        return orderRepository.save(order);
    }
}
