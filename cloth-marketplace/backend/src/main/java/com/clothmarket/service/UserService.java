package com.clothmarket.service;

import com.clothmarket.model.User;
import com.clothmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final String uploadDir = "uploads/profiles/";
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User getUserByMobile(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfileImage(Long userId, MultipartFile file) throws IOException {
        User user = getUserById(userId);

        // 1. Path ko clean rakhein (Root directory se start karein)
        Path uploadPath = Paths.get("uploads", "profiles");

        // 2. Directory banayein agar nahi hai
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 3. Unique filename banayein
        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;

        // 4. File save karein (Files.copy zyada reliable hai)
        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = uploadPath.resolve(filename);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioe) {
            throw new IOException("Could not save image file: " + filename, ioe);
        }

        // 5. Database mein path save karein
        // Note: URL hamesha forward slash (/) se start karein taaki frontend pe load ho sake
        user.setProfileImage("/uploads/profiles/" + filename);
        return userRepository.save(user);
    }
}
