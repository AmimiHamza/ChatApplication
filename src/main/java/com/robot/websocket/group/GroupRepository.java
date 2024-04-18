package com.robot.websocket.group;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, String> {

    @Query(value = "SELECT * FROM testo.chat_group WHERE EXISTS (SELECT 1 FROM unnest(users) AS u(nickname) WHERE u.nickname = :nickname)", nativeQuery = true)

    List<Group> findAllByUser(String nickname);

}
