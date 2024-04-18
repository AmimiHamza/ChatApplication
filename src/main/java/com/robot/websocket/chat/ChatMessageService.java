package com.robot.websocket.chat;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import com.robot.websocket.chatroom.ChatRoomService;

import java.util.List;

@Service
@AllArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessage saveusermessage(ChatMessage chatMessage) {
        System.out.println("kako");
        System.out.println(chatMessage.getContent());
        System.out.println(chatMessage.getSenderId());

        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true);
                System.out.println("kakko");
                System.out.println(chatId);


        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }
    public ChatMessage savegroupmessage(ChatMessage chatMessage) {
        System.out.println("kako");
        System.out.println(chatMessage.getContent());
        System.out.println(chatMessage.getSenderId());

        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getRecipientId(), chatMessage.getRecipientId(), true);
                 // You can create your own dedicated exception
        System.out.println("kakko");
        System.out.println(chatId);

        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }
    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        System.out.println("kakke");
        System.out.println(senderId);
        System.out.println(recipientId);
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, true);
        var inversedchatId = chatRoomService.getChatRoomId( recipientId,senderId, true);
        System.out.println(chatId);
        return repository.findByChatIdOrChatId(chatId, inversedchatId);
    }
    
}
