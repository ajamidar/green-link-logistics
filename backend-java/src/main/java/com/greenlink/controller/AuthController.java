package com.greenlink.controller;

import com.greenlink.dto.AuthLoginRequest;
import com.greenlink.dto.AuthRegisterRequest;
import com.greenlink.dto.AuthResponse;
import com.greenlink.model.Role;
import com.greenlink.model.User;
import com.greenlink.repository.DriverRepository;
import com.greenlink.repository.UserRepository;
import com.greenlink.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            DriverRepository driverRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRegisterRequest request) {
        if (userRepository.existsByUsername(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User user = new User();
        user.setUsername(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() == null ? Role.DISPATCHER : request.getRole());
        user.setFullName(request.getName());
        if (user.getRole() == Role.DRIVER) {
            var matchingDriver = driverRepository.findFirstByEmailIgnoreCase(request.getEmail());
            user.setOrganizationId(matchingDriver.map(com.greenlink.model.Driver::getOrganizationId)
                    .orElse(java.util.UUID.randomUUID()));
        } else {
            user.setOrganizationId(java.util.UUID.randomUUID());
        }

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, savedUser.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthLoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getEmail()).orElseThrow();
        if (user.getRole() == Role.DRIVER) {
            var matchingDriver = driverRepository.findFirstByEmailIgnoreCase(user.getUsername());
            if (matchingDriver.isPresent() && !matchingDriver.get().getOrganizationId().equals(user.getOrganizationId())) {
                user.setOrganizationId(matchingDriver.get().getOrganizationId());
                user = userRepository.save(user);
            }
        }
        if (user.getOrganizationId() == null) {
            user.setOrganizationId(java.util.UUID.randomUUID());
            user = userRepository.save(user);
        }
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(token, user.getRole()));
    }
}
