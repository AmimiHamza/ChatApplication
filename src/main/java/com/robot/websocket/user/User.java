package com.robot.websocket.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
}
