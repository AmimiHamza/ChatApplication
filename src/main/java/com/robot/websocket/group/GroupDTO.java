package com.robot.websocket.group;

import java.util.List;

import lombok.Data;
@Data
public class GroupDTO {
    private String name;
    private String creator;
    private List<String> users;
    
}
