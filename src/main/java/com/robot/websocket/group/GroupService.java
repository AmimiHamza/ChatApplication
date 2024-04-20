package com.robot.websocket.group;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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
        System.out.println(group);
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
}
