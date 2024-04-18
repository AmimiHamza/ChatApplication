package com.robot.websocket.group;

import lombok.AllArgsConstructor;

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

    @MessageMapping("/group.addgroup")
    @SendTo("/user/public")
    public Group addGroup(@Payload Group group) {
        groupService.saveGroup(group);
        return group;
    }
    @GetMapping("/groups/{nickname}")
    public ResponseEntity<List<Group>> getGroupsByNickname(@PathVariable String nickname) { 
        List<Group> groups = groupService.findallgroupsofnickname(nickname);
        return ResponseEntity.ok(groups);
    }
    
}
