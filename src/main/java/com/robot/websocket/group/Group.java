package com.robot.websocket.group;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat_group",schema = "testo")
public class Group {
    @Id
    private String id;
    private String name;
    private List<String> users;
    private String creator;
    private List<String> admins;
    private Date createdDate;
}
