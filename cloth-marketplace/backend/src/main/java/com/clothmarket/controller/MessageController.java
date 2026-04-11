package com.clothmarket.controller;

import com.clothmarket.model.Message;
import com.clothmarket.model.User;
import com.clothmarket.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    
    private final MessageService messageService;
    
    @PostMapping("/send/text")
    public ResponseEntity<?> sendTextMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String message) {
        try {
            Message savedMessage = messageService.sendTextMessage(senderId, receiverId, message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/send/voice")
    public ResponseEntity<?> sendVoiceMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam("file") MultipartFile voiceFile) {
        try {
            Message savedMessage = messageService.sendVoiceMessage(senderId, receiverId, voiceFile);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/chat")
    public ResponseEntity<List<Message>> getChatMessages(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        try {
            List<Message> messages = messageService.getChatMessages(userId1, userId2);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/chat-users/{userId}")
    public ResponseEntity<List<User>> getChatUsers(@PathVariable Long userId) {
        try {
            List<User> users = messageService.getChatUsers(userId);
            // Remove passwords
            users.forEach(user -> user.setPassword(null));
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    private record ErrorResponse(String message) {}
}
