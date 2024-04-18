package com.robot.websocket.group;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    public Group saveGroup(Group group) {
        return groupRepository.save(group);
    }
    public List<Group> findallgroupsofnickname(String nickname) {
        return groupRepository.findAllByUser(nickname);
    }
}
