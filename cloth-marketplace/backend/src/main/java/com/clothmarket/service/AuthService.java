package com.clothmarket.service;

import com.clothmarket.dto.AuthResponse;
import com.clothmarket.dto.LoginRequest;
import com.clothmarket.dto.SignUpRequest;
import com.clothmarket.model.User;
import com.clothmarket.repository.UserRepository;
import com.clothmarket.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public AuthResponse signUp(SignUpRequest request) {
        // Check if user already exists
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setLocation(request.getLocation());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user = userRepository.save(user);
        
        // Generate token
        String token = jwtUtil.generateToken(user.getId(), user.getMobile());
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getName(),
            user.getMobile(),
            user.getLocation(),
            user.getProfileImage(),
            "User registered successfully"
        );
    }
    
    public AuthResponse login(LoginRequest request) {
        // Find user by mobile
        User user = userRepository.findByMobile(request.getMobile())
                .orElseThrow(() -> new RuntimeException("Invalid mobile number or password"));
        
        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid mobile number or password");
        }
        
        // Generate token
        String token = jwtUtil.generateToken(user.getId(), user.getMobile());
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getName(),
            user.getMobile(),
            user.getLocation(),
            user.getProfileImage(),
            "Login successful"
        );
    }
    private Map<String, String> otpStorage = new HashMap<>();
}
