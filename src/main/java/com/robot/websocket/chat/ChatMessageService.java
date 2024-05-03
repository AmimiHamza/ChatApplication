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
        var inversedchatId = getChatRoomId( recipientId,senderId, true);
        return repository.findByChatIdOrChatId(chatId, inversedchatId);
    }

    public void deleteChatMessages(String chatId) {
        List<ChatMessage> chatMessages = chatMessageRepository.findAll();
        System.out.println("liis"+chatMessages);
        for (ChatMessage chatMessage : chatMessages) {
            if (chatMessage.getChatId().equals(chatId)) {
                System.out.println("haha"+chatMessage);
                chatMessageRepository.delete(chatMessage);
            }
        }
    }

    public String getChatRoomId(
        String senderId,
        String recipientId,
        boolean createNewRoomIfNotExists
) {
    var chatId = String.format("%s_%s", senderId, recipientId);
            return chatId;
}
    
}
