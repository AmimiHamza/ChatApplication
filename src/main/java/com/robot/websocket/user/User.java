package com.robot.websocket.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat_user",schema = "testo")

public class User {
    @Id
    private String nickName;
    private String fullName;
    private Status status;
    private List<String> groups = new ArrayList<>();


    public void addGroup(String group){
            List<String> groups = this.getGroups();
            if (groups == null) 
            {
                groups = new ArrayList<String>();
                
            }
            groups.add(group);

        }


    public void removeGroup(String groupId) {
        List<String> groups = this.getGroups();
        if (groups == null) {
            groups = new ArrayList<String>();
        }
        groups.remove(groupId);
    }
    }


