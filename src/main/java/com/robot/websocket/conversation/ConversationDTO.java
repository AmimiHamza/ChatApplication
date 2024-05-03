package com.robot.websocket.conversation;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.robot.websocket.chat.ChatMessage;
import com.robot.websocket.user.User;

import jakarta.persistence.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDTO {
    @Id
    private Long chatId;
    private Long member1Id;
    private Long member2Id;
    private ChatMessage lastMessage;   
}
