package com.clothmarket.service;

import com.clothmarket.dto.ChatPreview;
import com.clothmarket.model.Message;
import com.clothmarket.model.User;
import com.clothmarket.repository.MessageRepository;
import com.clothmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final String uploadDir = "uploads/voice/";

    public Message sendTextMessage(Long senderId, Long receiverId, String messageText) {
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setMessage(messageText);
        message.setMessageType("text");

        return messageRepository.save(message);
    }

    public Message sendVoiceMessage(Long senderId, Long receiverId, MultipartFile voiceFile) throws IOException {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String originalFilename = voiceFile.getOriginalFilename();
        String extension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".webm";
        String filename = UUID.randomUUID().toString() + extension;

        Path filepath = Paths.get(uploadDir + filename);
        Files.write(filepath, voiceFile.getBytes());

        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setVoiceUrl("/uploads/voice/" + filename);
        message.setMessageType("voice");

        return messageRepository.save(message);
    }

    public List<Message> getChatMessages(Long userId1, Long userId2) {
        List<Message> messages = messageRepository.findChatMessages(userId1, userId2);

        messages.forEach(message -> {
            User sender = userRepository.findById(message.getSenderId()).orElse(null);
            User receiver = userRepository.findById(message.getReceiverId()).orElse(null);

            if (sender != null) {
                message.setSenderName(sender.getName());
            }
            if (receiver != null) {
                message.setReceiverName(receiver.getName());
            }
        });

        return messages;
    }

    public List<User> getChatUsers(Long userId) {
        List<Long> userIds = messageRepository.findChatUserIds(userId);
        List<User> users = new ArrayList<>();

        for (Long id : userIds) {
            userRepository.findById(id).ifPresent(users::add);
        }

        return users;
    }

    /**
     * Inbox list: har chat partner ke saath last message + unread count,
     * sorted by most-recent-interaction first (WhatsApp jaisa).
     */
    public List<ChatPreview> getInbox(Long userId) {
        List<Long> partnerIds = messageRepository.findChatUserIds(userId);
        List<ChatPreview> previews = new ArrayList<>();

        for (Long partnerId : partnerIds) {
            User partner = userRepository.findById(partnerId).orElse(null);
            if (partner == null) continue;
            partner.setPassword(null);

            List<Message> chatDesc = messageRepository.findChatMessagesDesc(userId, partnerId);
            if (chatDesc.isEmpty()) continue;

            Message last = chatDesc.get(0);
            long unread = messageRepository.countUnreadInChat(partnerId, userId);

            String preview = "text".equals(last.getMessageType())
                    ? last.getMessage()
                    : "Voice message";

            previews.add(new ChatPreview(
                    partner,
                    preview,
                    last.getMessageType(),
                    last.getCreatedAt(),
                    unread,
                    last.getSenderId().equals(userId)
            ));
        }

        previews.sort(Comparator.comparing(ChatPreview::getLastMessageTime).reversed());
        return previews;
    }

    public long getUnreadCount(Long userId) {
        return messageRepository.countTotalUnread(userId);
    }

    @Transactional
    public void markAsRead(Long fromUserId, Long toUserId) {
        messageRepository.markAsRead(fromUserId, toUserId);
    }
}