//package com.clothmarket.controller;
//
//import com.clothmarket.model.User;
//import com.clothmarket.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//
//@RestController
//// अगर आपके फ्रंटएंड में URL में /api/users है, तो यहाँ /api/users कर दें, वरना सिर्फ /users रहने दें
//@RequestMapping("/api/users")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
//public class UserController {
//
//    private final UserService userService;
//
//    @GetMapping("/{userId}")
//    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
//        try {
//            User user = userService.getUserById(userId);
//            user.setPassword(null);
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @GetMapping("/mobile/{mobile}")
//    public ResponseEntity<User> getUserByMobile(@PathVariable String mobile) {
//        try {
//            User user = userService.getUserByMobile(mobile);
//            user.setPassword(null);
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    // इसी एक मेथड को रखिए, यही फोटो अपलोड भी करेगा और DB भी अपडेट करेगा
//    @PostMapping("/{userId}/upload-photo")
//    public ResponseEntity<?> uploadPhoto(
//            @PathVariable Long userId,
//            @RequestParam("file") MultipartFile file) {
//        try {
//            // आपकी सर्विस सीधे 'file' (MultipartFile) लेती है और खुद ही सब सेव करती है
//            User updatedUser = userService.updateProfileImage(userId, file);
//
//            // सुरक्षा के लिए पासवर्ड नल करें
//            updatedUser.setPassword(null);
//
//            // फ्रंटएंड को अपडेटेड यूजर ऑब्जेक्ट वापस भेजें
//            return ResponseEntity.ok(updatedUser);
//
//        } catch (Exception e) {
//            // System.error की जगह System.err कर दिया है ताकि एरर न आए
//            System.err.println("Error uploading photo: " + e.getMessage());
//            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to upload image: " + e.getMessage()));
//        }
//    }
//    private record ErrorResponse(String message) {}
//}

package com.clothmarket.controller;

import com.clothmarket.model.User;
import com.clothmarket.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
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

    @PostMapping("/{id}/upload-photo")
    public ResponseEntity<?> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            // UserService का मेथड सीधे MultipartFile लेता है और 'id' के आधार पर यूजर ढूंढता है
            User updatedUser = userService.updateProfileImage(id, file);
            updatedUser.setPassword(null); // सुरक्षा के लिए पासवर्ड छुपाएं
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            System.err.println("Error uploading photo: " + e.getMessage());
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to upload image: " + e.getMessage()));
        }
    }

    private record ErrorResponse(String message) {}
}

//package com.clothmarket.controller;
//
//import com.clothmarket.model.User;
//import com.clothmarket.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//@RestController
//@RequestMapping("/api/users") // फ्रंटएंड के फेच URL (/api/users/...) से मैच करने के लिए
//@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
//public class UserController {
//
//    private final UserService userService;
//
//    // 1. Get User by ID (User मॉडल के 'id' वेरिएबल से सिंक किया गया)
//    @GetMapping("/{userid}")
//    public ResponseEntity<User> getUserById(@PathVariable Long id) {
//        try {
//            User user = userService.getUserById(id);
//            user.setPassword(null); // सुरक्षा के लिए पासवर्ड छुपाएं
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    // 2. Get User by Mobile
//    @GetMapping("/mobile/{mobile}")
//    public ResponseEntity<User> getUserByMobile(@PathVariable String mobile) {
//        try {
//            User user = userService.getUserByMobile(mobile);
//            user.setPassword(null);
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    // 3. Profile Photo Upload Endpoint
//    // फ्रंटएंड इसी एंडपॉइंट (/api/users/{id}/upload-photo) पर हिट करेगा
//    @PostMapping("/{userid}/upload-photo")
//    public ResponseEntity<?> uploadPhoto(
//            @PathVariable Long id,
//            @RequestParam("file") MultipartFile file) {
//        try {
//            // आपकी UserService का परफेक्ट मेथड यहाँ कॉल हो रहा है
//            User updatedUser = userService.updateProfileImage(id, file);
//            updatedUser.setPassword(null);
//
//            return ResponseEntity.ok(updatedUser);
//        } catch (Exception e) {
//            System.err.println("Error uploading photo: " + e.getMessage());
//            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
//        }
//    }
//
//    // एरर रिपॉन्स रिकॉर्ड
//    private record ErrorResponse(String message) {}
//}
//package com.clothmarket.controller;
//
//import com.clothmarket.model.User;
//import com.clothmarket.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//@RestController
//@RequestMapping("/users")   // /api already application.properties me hai — dobara mat likho
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*") // WebConfig me bhi hai, ye sirf safety ke liye
//public class UserController {
//
//    private final UserService userService;
//
//    @GetMapping("/{userId}")                          // naam 'userId' rakho
//    public ResponseEntity<User> getUserById(@PathVariable Long userId) {  // same naam
//        try {
//            User user = userService.getUserById(userId);
//            user.setPassword(null);
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @GetMapping("/mobile/{mobile}")
//    public ResponseEntity<User> getUserByMobile(@PathVariable String mobile) {
//        try {
//            User user = userService.getUserByMobile(mobile);
//            user.setPassword(null);
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PostMapping("/{userId}/profile-image")           // frontend ke api.js se exactly match
//    public ResponseEntity<?> updateProfileImage(
//            @PathVariable Long userId,                // same naam — path variable se match
//            @RequestParam("file") MultipartFile file) {
//        try {
//            User updatedUser = userService.updateProfileImage(userId, file);
//            updatedUser.setPassword(null);
//            return ResponseEntity.ok(updatedUser);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
//        }
//    }
//
//    private record ErrorResponse(String message) {}
//}