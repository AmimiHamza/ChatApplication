package com.robot.websocket.chatroom;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    ChatRoom findBySenderIdAndRecipientId(String senderId, String recipientId);

    ChatRoom findByChatId(String chatId);
}
