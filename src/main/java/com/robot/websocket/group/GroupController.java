package com.robot.websocket.group;

import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.robot.websocket.chat.ChatMessage;
import com.robot.websocket.chat.ChatMessageService;
import com.robot.websocket.user.User;

@Controller
@AllArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/group.groups")
    @SendTo("/user/public")
    public GroupDTO addGroup(@Payload GroupDTO groupDTO) {
        groupService.saveGroup(groupDTO);
        return groupDTO;
    }
    @DeleteMapping("/groups/{groupid}")
    public ResponseEntity<String> deleteGroup(@PathVariable("groupid") String groupId, @RequestBody Map<String, String> user) {
            groupService.deleteGroup(groupId,user.get("name"));
            return ResponseEntity.ok("Group deleted successfully");
    
    }

    @GetMapping("/groups/{recipientId}/messages")
    public ResponseEntity<List<ChatMessage>> findGroupChatMessages(@PathVariable String recipientId) {
        
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(recipientId, recipientId));
    }

    @GetMapping("/groups/{groupid}/users")
    public ResponseEntity<List<User>> findGroupUsers(@PathVariable("groupid") String groupId) {
        List<User> users = groupService.findUsers(groupId);
        return ResponseEntity.ok(users);
    }
    
    
}
