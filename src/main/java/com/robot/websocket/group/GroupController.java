package com.robot.websocket.group;

import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@AllArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @MessageMapping("/group.groups")
    @SendTo("/user/public")
    public GroupDTO addGroup(@Payload GroupDTO groupDTO) {
        System.out.println("papapa: " + groupDTO);
        
        groupService.saveGroup(groupDTO);
        return groupDTO;
    }
    
    
}
