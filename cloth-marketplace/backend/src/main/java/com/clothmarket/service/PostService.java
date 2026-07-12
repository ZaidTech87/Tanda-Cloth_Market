//
//
//package com.clothmarket.service;
//
//import com.clothmarket.dto.PostRequest;
//import com.clothmarket.model.Post;
//import com.clothmarket.model.User;
//import com.clothmarket.repository.PostRepository;
//import com.clothmarket.repository.UserRepository;
//
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.io.IOException;
//
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//
//import java.util.List;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class PostService {
//
//    private final PostRepository postRepository;
//    private final UserRepository userRepository;
//
//    public Post createPost(
//            Long userId,
//            PostRequest request,
//            MultipartFile file
//    ) throws IOException {
//
//        // ================= FIND USER =================
//        User user = userRepository.findById(userId)
//                .orElseThrow(() ->
//                        new RuntimeException("User not found"));
//
//        // ================= CREATE POST =================
//        Post post = new Post();
//
//        post.setUser(user);
//        post.setUserId(userId);
//
//        post.setDescription(request.getDescription());
//        post.setPrice(request.getPrice());
//        post.setQuantity(request.getQuantity());
//        post.setClothType(request.getClothType());
//
//        // ================= HANDLE FILE UPLOAD =================
//        if (file != null && !file.isEmpty()) {
//
//            // Absolute uploads path
//            String uploadPath =
//                    System.getProperty("user.dir")
//                            + File.separator
//                            + "uploads"
//                            + File.separator
//                            + "posts";
//
//            // Create directory if not exists
//            File uploadDirectory = new File(uploadPath);
//
//            if (!uploadDirectory.exists()) {
//                uploadDirectory.mkdirs();
//            }
//
//            // Original filename
//            String originalFilename = file.getOriginalFilename();
//
//            // Safe extension extraction
//            String extension = "";
//
//            if (originalFilename != null
//                    && originalFilename.contains(".")) {
//
//                extension = originalFilename.substring(
//                        originalFilename.lastIndexOf(".")
//                );
//            }
//
//            // Unique filename
//            String uniqueFilename =
//                    UUID.randomUUID().toString() + extension;
//
//            // Full save path
//            Path filePath = Paths.get(
//                    uploadPath,
//                    uniqueFilename
//            );
//
//            // Save file safely
//            Files.copy(
//                    file.getInputStream(),
//                    filePath,
//                    StandardCopyOption.REPLACE_EXISTING
//            );
//
//            // IMPORTANT:
//            // Save ONLY URL path in DB
//            post.setMediaUrl(
//                    "/uploads/posts/" + uniqueFilename
//            );
//
//            // Detect media type
//            String contentType = file.getContentType();
//
//            if (contentType != null) {
//
//                if (contentType.startsWith("image/")) {
//                    post.setMediaType("image");
//                }
//
//                else if (contentType.startsWith("video/")) {
//                    post.setMediaType("video");
//                }
//            }
//
//            // Debug logs
//            System.out.println("=================================");
//            System.out.println("FILE SAVED SUCCESSFULLY");
//            System.out.println("Saved at: " + filePath);
//            System.out.println("Media URL: " + post.getMediaUrl());
//            System.out.println("=================================");
//        }
//
//        // ================= SAVE POST =================
//        return postRepository.save(post);
//    }
//
//    // ================= FEED =================
//    public Page<Post> getFeed(int page, int size) {
//
//        Pageable pageable = PageRequest.of(page, size);
//
//        Page<Post> posts =
//                postRepository.findAllOrderByCreatedAtDesc(pageable);
//
//        // Add user details
//        posts.forEach(post -> {
//
//            User user = userRepository
//                    .findById(post.getUserId())
//                    .orElse(null);
//
//            if (user != null) {
//
//                post.setUserName(user.getName());
//
//                post.setUserLocation(user.getLocation());
//
//                post.setUserProfileImage(
//                        user.getProfileImage()
//                );
//            }
//        });
//
//        return posts;
//    }
//
//    // ================= USER POSTS =================
//    public List<Post> getUserPosts(Long userId) {
//
//        List<Post> posts =
//                postRepository.findUserPosts(userId);
//
//        User user = userRepository
//                .findById(userId)
//                .orElse(null);
//
//        if (user != null) {
//
//            posts.forEach(post -> {
//
//                post.setUserName(user.getName());
//
//                post.setUserLocation(user.getLocation());
//
//                post.setUserProfileImage(
//                        user.getProfileImage()
//                );
//            });
//        }
//
//        return posts;
//    }
//
//    // ================= SINGLE POST =================
//    public Post getPostById(Long postId) {
//
//        Post post = postRepository.findById(postId)
//                .orElseThrow(() ->
//                        new RuntimeException("Post not found"));
//
//        User user = userRepository
//                .findById(post.getUserId())
//                .orElse(null);
//
//        if (user != null) {
//
//            post.setUserName(user.getName());
//
//            post.setUserLocation(user.getLocation());
//
//            post.setUserProfileImage(
//                    user.getProfileImage()
//            );
//        }
//
//        return post;
//    }
//    // ================= DELETE POST =================
//    public void deletePost(Long postId, Long userId) throws IOException {
//
//        // Sirf apni post delete kar sakta hai
//        Post post = postRepository.findByIdAndUserId(postId, userId)
//                .orElseThrow(() ->
//                        new RuntimeException("Post not found or access denied"));
//
//        // Media file delete karo (agar hai)
//        if (post.getMediaUrl() != null && !post.getMediaUrl().isBlank()) {
//
//            String mediaPath = post.getMediaUrl();
//
//            if (mediaPath.startsWith("/")) {
//                mediaPath = mediaPath.substring(1);
//            }
//
//            Path filePath = Paths.get(
//                    System.getProperty("user.dir"),
//                    mediaPath.replace("/", File.separator)
//            );
//
//            try {
//                Files.deleteIfExists(filePath);
//                System.out.println("Deleted media: " + filePath);
//            } catch (Exception e) {
//                System.out.println("Unable to delete media file: " + filePath);
//            }
//        }
//
//        // Database se post delete
//        postRepository.delete(post);
//    }
//}


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
import java.nio.file.StandardCopyOption;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // ================= CREATE POST =================
    public Post createPost(
            Long userId,
            PostRequest request,
            MultipartFile file
    ) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setUserId(userId);
        post.setDescription(request.getDescription());
        post.setPrice(request.getPrice());
        post.setQuantity(request.getQuantity());
        post.setClothType(request.getClothType());

        // ================= FILE UPLOAD =================
        if (file != null && !file.isEmpty()) {

            String uploadPath =
                    System.getProperty("user.dir")
                            + File.separator
                            + "uploads"
                            + File.separator
                            + "posts";

            File uploadDirectory = new File(uploadPath);
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null
                    && originalFilename.contains(".")) {
                extension = originalFilename.substring(
                        originalFilename.lastIndexOf(".")
                );
            }

            String uniqueFilename =
                    UUID.randomUUID().toString() + extension;

            Path filePath = Paths.get(uploadPath, uniqueFilename);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            post.setMediaUrl("/uploads/posts/" + uniqueFilename);

            String contentType = file.getContentType();
            if (contentType != null) {
                if (contentType.startsWith("image/")) {
                    post.setMediaType("image");
                } else if (contentType.startsWith("video/")) {
                    post.setMediaType("video");
                }
            }

            System.out.println("=================================");
            System.out.println("FILE SAVED: " + filePath);
            System.out.println("MEDIA URL: " + post.getMediaUrl());
            System.out.println("=================================");
        }

        // Post save karo — createdAt @PrePersist se auto set hoga
        Post savedPost = postRepository.save(post);

        // Naye post me bhi user info set karo
        // taaki frontend ko turant sahi data mile
        savedPost.setUserName(user.getName());
        savedPost.setUserLocation(user.getLocation());
        savedPost.setUserProfileImage(user.getProfileImage());

        return savedPost;
    }

    // ================= FEED (N+1 fix) =================
    public Page<Post> getFeed(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts =
                postRepository.findAllOrderByCreatedAtDesc(pageable);

        // ✅ Sab userIds ek baar nikalo
        List<Long> userIds = posts.stream()
                .map(Post::getUserId)
                .distinct()
                .collect(Collectors.toList());

        // ✅ Ek hi DB query me saare users fetch karo
        Map<Long, User> userMap = userRepository.findAllById(userIds)
                .stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        // ✅ Map se user info set karo — koi extra DB call nahi
        posts.forEach(post -> {
            User user = userMap.get(post.getUserId());
            if (user != null) {
                post.setUserName(user.getName());
                post.setUserLocation(user.getLocation());
                post.setUserProfileImage(user.getProfileImage());
            }
        });

        return posts;
    }

    // ================= USER POSTS =================
    public List<Post> getUserPosts(Long userId) {

        List<Post> posts = postRepository.findUserPosts(userId);

        // getUserPosts me sirf ek user ke posts hain
        // isliye ek query kaafi hai
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

    // ================= SINGLE POST =================
    public Post getPostById(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        User user = userRepository
                .findById(post.getUserId())
                .orElse(null);

        if (user != null) {
            post.setUserName(user.getName());
            post.setUserLocation(user.getLocation());
            post.setUserProfileImage(user.getProfileImage());
        }

        return post;
    }

    // ================= DELETE POST =================
    public void deletePost(Long postId, Long userId) throws IOException {

        Post post = postRepository.findByIdAndUserId(postId, userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Post not found or access denied"));

        // Media file bhi delete karo
        if (post.getMediaUrl() != null
                && !post.getMediaUrl().isBlank()) {

            String mediaPath = post.getMediaUrl();

            if (mediaPath.startsWith("/")) {
                mediaPath = mediaPath.substring(1);
            }

            Path filePath = Paths.get(
                    System.getProperty("user.dir"),
                    mediaPath.replace("/", File.separator)
            );

            try {
                Files.deleteIfExists(filePath);
                System.out.println("Media deleted: " + filePath);
            } catch (Exception e) {
                System.out.println(
                        "Could not delete media: " + filePath);
            }
        }

        postRepository.delete(post);
    }
}