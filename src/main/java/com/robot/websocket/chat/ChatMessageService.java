package com.robot.websocket.chat;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import com.robot.websocket.chatroom.ChatRoom;
import com.robot.websocket.chatroom.ChatRoomService;

import java.util.List;

@Service
@AllArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;
    private final ChatMessageRepository chatMessageRepository;

    public ChatMessage saveusermessage(ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true);


        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }
    public ChatMessage savegroupmessage(ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getRecipientId(), chatMessage.getRecipientId(), true);
                 // You can create your own dedicated exception

        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }
    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, true);
        var inversedchatId = chatRoomService.getChatRoomId( recipientId,senderId, true);
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
    
}
