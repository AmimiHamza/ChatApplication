package com.robot.websocket.chatroom;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chat_room",schema = "testo")
public class ChatRoom {
    @Id
    private Long id;
    private String chatId;
    private String senderId;
    private String recipientId;
    
    private static long currentMaxId = 1;

    public ChatRoom(String chatId, String senderId, String recipientId) {
        this.chatId = chatId;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.id = currentMaxId++;
    }
    
}
