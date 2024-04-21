package com.robot.websocket.group;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.robot.websocket.user.User;
import com.robot.websocket.user.UserRepository;

@Service
@RequiredArgsConstructor
public class GroupService {
    private final UserRepository UserRepository;
    private final GroupRepository groupRepository;

    public Group saveGroup(GroupDTO groupDTO) {
        Group group = new Group();
        group.setName(groupDTO.getName());
        group.setCreator(groupDTO.getCreator());
        group.setUsers(groupDTO.getUsers());
        group.setId(groupDTO.getName() + groupDTO.getCreator() + System.currentTimeMillis());
        final List<String> admins = new ArrayList<String>();
        admins.add(groupDTO.getCreator());
        group.setAdmins(admins);
        group.setCreatedDate(new java.sql.Date(System.currentTimeMillis()));
        for (String user : groupDTO.getUsers()) {
            User user1 = UserRepository.findByNickName(user);
            user1.addGroup(group.getId());
            UserRepository.save(user1);
        }
        return groupRepository.save(group);
    }
    public List<Group> findallgroupsofnickname(String nickname) {
        return groupRepository.findAllByUser(nickname);
    }
    public void deleteGroup(String groupId, String username) {
        Group group = groupRepository.findById(groupId).get();
        if (group.getCreator().equals(username)) {
            groupRepository.delete(group);
            for (String user : group.getUsers()) {
                User user1 = UserRepository.findByNickName(user);
                user1.removeGroup(groupId);
                UserRepository.save(user1);
            }
        }
        throw new UnsupportedOperationException("Unimplemented method 'deleteGroup'");
    }
    public Group findById(String groupId) {
        Group group=groupRepository.findById(groupId).get();
        return group;
    }
    public List<User> findUsers(String groupId) {
        Group group = groupRepository.findById(groupId).get();
        List<User> users = new ArrayList<User>();
        for (String user : group.getUsers()) {
            users.add(UserRepository.findByNickName(user));
        }
        return users;

    }
    public void addGroupMembers(String groupId, List<String> users) {
        Group group = groupRepository.findById(groupId).get();
        for (String user : users) {
            if (!group.getUsers().contains(user)){
            group.getUsers().add(user);
            User user1 = UserRepository.findByNickName(user);
            user1.addGroup(groupId);
            UserRepository.save(user1);
        }
        }
        groupRepository.save(group);
        
    }
    public ResponseEntity<String>   removeGroupMember(String groupId, String memberId, String username) {
        Group group = groupRepository.findById(groupId).get();
        if (!group.getCreator().equals(username)) {
            return ResponseEntity.badRequest().body("Creator cannot be removed");
        }else{
        group.getUsers().remove(memberId);
        User user = UserRepository.findByNickName(memberId);
        user.removeGroup(groupId);
        UserRepository.save(user);
        groupRepository.save(group);
        return ResponseEntity.ok("Member removed successfully");
        }
    }
}
