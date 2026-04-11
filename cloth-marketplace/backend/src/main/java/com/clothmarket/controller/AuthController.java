package com.clothmarket.controller;

import com.clothmarket.dto.AuthResponse;
import com.clothmarket.dto.LoginRequest;
import com.clothmarket.dto.SignUpRequest;
import com.clothmarket.model.User;
import com.clothmarket.repository.UserRepository;
import com.clothmarket.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ OTP storage (temporary)
    private Map<String, String> otpStorage = new HashMap<>();

    // ================= SIGNUP =================
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest request) {
        try {
            AuthResponse response = authService.signUp(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");

        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        otpStorage.put(mobile, otp);

        System.out.println("OTP: " + otp); // for testing

        return ResponseEntity.ok("OTP sent");
    }


    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (!otpStorage.containsKey(mobile) || !otpStorage.get(mobile).equals(otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpStorage.remove(mobile);

        return ResponseEntity.ok("Password reset successful");
    }

    // ================= ERROR =================
    private record ErrorResponse(String message) {}
}