package com.clothmarket.service;

import com.clothmarket.dto.PostRequest;
import com.clothmarket.model.Post;
import com.clothmarket.model.User;
import com.clothmarket.repository.PostRepository;
import com.clothmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final String uploadDir = "uploads/posts/";
    
    public Post createPost(Long userId, PostRequest request, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = new Post();
        post.setUser(user);
        post.setUserId(userId);
        post.setDescription(request.getDescription());
        post.setPrice(request.getPrice());
        post.setQuantity(request.getQuantity());
        post.setClothType(request.getClothType());
        
        if (file != null && !file.isEmpty()) {
            // Create upload directory if not exists
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filepath = Paths.get(uploadDir + filename);
            Files.write(filepath, file.getBytes());
            
            // Set media URL and type
            post.setMediaUrl("/uploads/posts/" + filename);
            
            // Determine media type
            String contentType = file.getContentType();
            if (contentType != null) {
                if (contentType.startsWith("image/")) {
                    post.setMediaType("image");
                } else if (contentType.startsWith("video/")) {
                    post.setMediaType("video");
                }
            }
        }
        
        return postRepository.save(post);
    }
    
    public Page<Post> getFeed(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findAllOrderByCreatedAtDesc(pageable);
        
        // Populate user details for each post
        posts.forEach(post -> {
            User user = userRepository.findById(post.getUserId()).orElse(null);
            if (user != null) {
                post.setUserName(user.getName());
                post.setUserLocation(user.getLocation());
                post.setUserProfileImage(user.getProfileImage());
            }
        });
        
        return posts;
    }
    
    public List<Post> getUserPosts(Long userId) {
        List<Post> posts = postRepository.findUserPosts(userId);
        
        // Populate user details
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            posts.forEach(post -> {
                post.setUserName(user.getName());
                post.setUserLocation(user.getLocation());
                post.setUserProfileImage(user.getProfileImage());
            });
        }
        
        return posts;
    }
    
    public Post getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.findById(post.getUserId()).orElse(null);
        if (user != null) {
            post.setUserName(user.getName());
            post.setUserLocation(user.getLocation());
            post.setUserProfileImage(user.getProfileImage());
        }
        
        return post;
    }
}
