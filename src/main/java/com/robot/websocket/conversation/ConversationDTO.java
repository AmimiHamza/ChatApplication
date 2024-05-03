package com.robot.websocket.conversation;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.security.Timestamp;
import java.util.Date;

import com.robot.websocket.chat.ChatMessage;
import com.robot.websocket.user.Status;
import com.robot.websocket.user.User;

import jakarta.persistence.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDTO {
    @Id
    private String chatId;
    private String email;
    private ChatMessage lastMessage;  
    private Status status; 
    private Date lastLogin;
    private String fullname;
}
