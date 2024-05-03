package com.robot.websocket.chat;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;


import java.util.List;

@Service
@AllArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatMessage saveusermessage(ChatMessage chatMessage) {
        var chatId = getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true);


        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }
    public ChatMessage savegroupmessage(ChatMessage chatMessage) {
        var chatId = getChatRoomId(chatMessage.getRecipientId(), chatMessage.getRecipientId(), true);

        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }
    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = getChatRoomId(senderId, recipientId, true);
        return repository.findByChatId(chatId);
    }

    public void deleteChatMessages(String chatId) {
        List<ChatMessage> chatMessages = chatMessageRepository.findAll();
        for (ChatMessage chatMessage : chatMessages) {
            if (chatMessage.getChatId().equals(chatId)) {
                chatMessageRepository.delete(chatMessage);
            }
        }
    }

    public String getChatRoomId(
        String senderId,
        String recipientId,
        boolean createNewRoomIfNotExists
) {
    var first = senderId.compareTo(recipientId) < 0 ? senderId : recipientId;
    var second = senderId.compareTo(recipientId) < 0 ? recipientId : senderId;
    var chatId = String.format("%s_%s",first, second);
            return chatId;
}
    
}
