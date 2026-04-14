package com.clothmarket.controller;

import com.clothmarket.model.User;
import com.clothmarket.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            // Don't send password
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/mobile/{mobile}")
    public ResponseEntity<User> getUserByMobile(@PathVariable String mobile) {
        try {
            User user = userService.getUserByMobile(mobile);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{userId}/profile-image")
    public ResponseEntity<?> updateProfileImage(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            User user = userService.updateProfileImage(userId, file);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    private record ErrorResponse(String message) {}
    @PostMapping("/{userId}/upload-photo")
    public ResponseEntity<?> uploadPhoto(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            // Path fix karein: Aapke project root ke 'uploads/posts' ki tarah 'uploads/profiles' banayein
            String uploadDir = "uploads/profiles/";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            String fileName = "user_" + userId + ".jpg";
            Path path = Paths.get(uploadDir + fileName);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // DB Update: user.setProfilePic(fileName) logic yahan aayega

            return ResponseEntity.ok().body("Uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
