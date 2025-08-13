package com.splitwise.service;

import com.splitwise.dto.GroupDto;
import com.splitwise.model.Group;
import com.splitwise.model.User;
import com.splitwise.repository.GroupRepository;
import com.splitwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public Group createGroup(GroupDto groupDto) {
        User createdBy = userRepository.findById(groupDto.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (groupRepository.existsByNameAndCreatedBy(groupDto.getName(), createdBy)) {
            throw new RuntimeException("Group with this name already exists for this user");
        }

        Group group = new Group(groupDto.getName(), groupDto.getDescription(), createdBy);
        group.addMember(createdBy); // Creator is automatically a member

        // Add other members if specified
        if (groupDto.getMemberIds() != null) {
            for (Long memberId : groupDto.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new RuntimeException("Member not found: " + memberId));
                group.addMember(member);
            }
        }

        return groupRepository.save(group);
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public List<Group> getGroupsByUserId(Long userId) {
        return groupRepository.findGroupsByUserId(userId);
    }

    public Group updateGroup(Long id, GroupDto groupDto) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (groupDto.getName() != null) {
            group.setName(groupDto.getName());
        }

        if (groupDto.getDescription() != null) {
            group.setDescription(groupDto.getDescription());
        }

        // Update members if specified
        if (groupDto.getMemberIds() != null) {
            // Clear existing members (except creator)
            Set<User> currentMembers = group.getMembers();
            currentMembers.removeIf(member -> !member.equals(group.getCreatedBy()));

            // Add new members
            for (Long memberId : groupDto.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new RuntimeException("Member not found: " + memberId));
                group.addMember(member);
            }
        }

        return groupRepository.save(group);
    }

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }

    public Group addMemberToGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        group.addMember(user);
        return groupRepository.save(group);
    }

    public Group removeMemberFromGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.equals(group.getCreatedBy())) {
            throw new RuntimeException("Cannot remove group creator");
        }

        group.removeMember(user);
        return groupRepository.save(group);
    }
}
