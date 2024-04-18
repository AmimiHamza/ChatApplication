package com.robot.websocket.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatIdOrChatId(String chatId, String inversedchatId);
}
