package com.robot.websocket.conversation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.robot.websocket.chat.ChatMessageService;
import com.robot.websocket.user.User;
import com.robot.websocket.chat.ChatMessage;
import com.robot.websocket.chat.ChatMessageRepository;
import com.robot.websocket.user.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final ChatMessageService chatMessageService;
    private final ChatMessageRepository chatMessageRepository;

    public List<ConversationDTO> findConversationsByEmail(String email) {
        List<Conversation> conversations = conversationRepository.findAllByMember1IdOrMember2Id(email,email);
        List<ConversationDTO> conversationDTOs = new ArrayList<>();
        for(Conversation conversation:conversations)
        {
            ChatMessage chatMessage=chatMessageService.findLastMessage(conversation.getChatId());
            String recepient=conversation.getMember1Id().equals(email)?conversation.getMember2Id():conversation.getMember1Id();
            User user=userRepository.findByEmail(recepient);

            ConversationDTO conversationDTO=new ConversationDTO();

            conversationDTO.setChatId(conversation.getChatId());
            conversationDTO.setEmail(recepient);
            conversationDTO.setFullname(user.getFullName());
            conversationDTO.setLastLogin(user.getLastLogin());
            conversationDTO.setStatus(user.getStatus());
            conversationDTO.setLastMessage(chatMessage);
            
            conversationDTOs.add(conversationDTO);
        }
        return conversationDTOs;
    

    }

    public List<ChatMessage> findConversationMessages(String conversationId) {
        return chatMessageRepository.findByChatId(conversationId);
        }
    
}
