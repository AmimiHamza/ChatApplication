package com.robot.websocket.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.robot.websocket.conversation.Conversation;
import com.robot.websocket.conversation.ConversationDTO;
import com.robot.websocket.conversation.ConversationService;
import com.robot.websocket.group.Group;
import com.robot.websocket.group.GroupService;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final GroupService groupService;
    private final UserRepository userRepository;
    private final ConversationService conversationService;

    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public User addUser(
            @Payload User user
    ) {
        User user1=userRepository.findByEmail(user.getEmail());
        if(user1==null)
        {
            user.setStatus(Status.ONLINE);
            userService.saveUser(user);
        }
        else
        {
            user1.setStatus(Status.ONLINE);
            userService.saveUser(user1);
        }
        return user;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public User disconnectUser(
            @Payload User user
    ) {
        userService.disconnect(user);
        return user;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findConnectedUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/user/{email}/groups")
    public ResponseEntity<List<Group>> getGroupsByEmail(@PathVariable String email) { 
        List<Group> groups = groupService.findallgroupsofemail(email);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) { 
        User user=userRepository.findByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/{email}/conversations")
    public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable String email) {
        List<ConversationDTO> conversations = conversationService.findConversationsByEmail(email);
        return ResponseEntity.ok(conversations);
    }





}
