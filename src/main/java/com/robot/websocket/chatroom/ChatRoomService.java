package com.robot.websocket.chatroom;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;
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
            return chatId;
}


    
    
}
