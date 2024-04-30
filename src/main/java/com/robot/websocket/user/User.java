package com.robot.websocket.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat_user",schema = "testo")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String fullName;
    private String password;
    private Status status;
    private Date lastLogin;
    private List<Long> groups = new ArrayList<>();


    public void addGroup(Long group){
            List<Long> groups = this.getGroups();
            if (groups == null) 
            {
                groups = new ArrayList<Long>();
                
            }
            groups.add(group);

        }


    public void removeGroup(Long groupId) {
        List<Long> groups = this.getGroups();
        if (groups == null) {
            groups = new ArrayList<Long>();
        }
        groups.remove(groupId);
    }
    }


