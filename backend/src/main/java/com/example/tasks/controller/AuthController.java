package com.example.tasks.controller;

import com.example.tasks.service.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> user) {

        String username = user.get("username");
        String password = user.get("password");

        // allow any user (for demo)
        if (username != null && password != null) {
            return jwtService.generateToken(username);
        }

        throw new RuntimeException("Invalid credentials");
    }
}