package com.robot.websocket.chatroom;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ChatRoomService {
    private ChatRoomRepository chatRoomRepository;


    public String getChatRoomId(
        String senderId,
        String recipientId,
        boolean createNewRoomIfNotExists
) {
    var chatId = String.format("%s_%s", senderId, recipientId);

    // ChatRoom existingRoom = chatRoomRepository.findByChatId(chatId);
    // if (existingRoom!=null) {
    //     return existingRoom.getChatId();
    // } else {
    //     if (createNewRoomIfNotExists) {
    //         return chatId;
    //     } else {
            return chatId;
        // }
    // }
}


    // private String createChatId(String senderId, String recipientId) {
    //     var chatId = String.format("%s_%s", senderId, recipientId);
    
    //     ChatRoom senderRecipient = new ChatRoom(chatId, senderId, recipientId);
    //     ChatRoom recipientSender = new ChatRoom(chatId, recipientId, senderId);
    
    //     chatRoomRepository.save(senderRecipient);
    //     chatRoomRepository.save(recipientSender);
    
    //     return chatId;
    // }
    
}
