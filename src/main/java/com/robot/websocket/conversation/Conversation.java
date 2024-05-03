package com.robot.websocket.conversation;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


import com.robot.websocket.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat_conversation",schema = "testo")
public class Conversation {
    @Id
    private Long chatId;
    private Long member1Id;
    private Long member2Id;
}
