package com.greenlink.dto;

import com.greenlink.model.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public class AccountResponse {
    private final UUID id;
    private final String email;
    private final Role role;
    private final String fullName;
    private final String phoneNumber;
    private final LocalDateTime createdAt;

    public AccountResponse(UUID id, String email, Role role, String fullName, String phoneNumber, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
