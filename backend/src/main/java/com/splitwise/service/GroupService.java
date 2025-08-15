package com.splitwise.service;

import com.splitwise.dto.GroupDto;
import com.splitwise.model.Group;
import com.splitwise.model.User;
import com.splitwise.repository.GroupRepository;
import com.splitwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    public GroupDto createGroup(GroupDto groupDto) {
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

        Group savedGroup = groupRepository.save(group);
        return convertToDto(savedGroup);
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public List<Group> getGroupsByUserId(Long userId) {
        return groupRepository.findGroupsByUserId(userId);
    }

    public GroupDto updateGroup(Long id, GroupDto groupDto) {
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

        Group savedGroup = groupRepository.save(group);
        return convertToDto(savedGroup);
    }

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }

    // Enhanced Group Methods
    public List<GroupDto> getGroupsByUser(Long userId) {
        List<Group> groups = groupRepository.findGroupsByUserId(userId);
        return groups.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public GroupDto getGroupById(Long id) {
        Optional<Group> groupOpt = groupRepository.findById(id);
        return groupOpt.map(this::convertToDto).orElse(null);
    }

    public boolean isUserMemberOfGroup(Long userId, Long groupId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            return false;
        }
        Group group = groupOpt.get();
        return group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(userId));
    }

    public boolean isUserAdminOfGroup(Long userId, Long groupId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            return false;
        }
        Group group = groupOpt.get();
        return group.getCreatedBy().getId().equals(userId);
    }

    public List<User> getGroupMembers(Long groupId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            return List.of();
        }
        return new ArrayList<>(groupOpt.get().getMembers());
    }

    public int getGroupMemberCount(Long groupId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        return groupOpt.map(group -> group.getMembers().size()).orElse(0);
    }

    public int getGroupExpenseCount(Long groupId) {
        // This would need to be implemented based on your expense model
        // For now, returning 0 as placeholder
        return 0;
    }

    public double getGroupTotalSpent(Long groupId) {
        // This would need to be implemented based on your expense model
        // For now, returning 0.0 as placeholder
        return 0.0;
    }

    public boolean isGroupActive(Long groupId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        return groupOpt.map(Group::isActive).orElse(false);
    }

    public boolean isGroupArchived(Long groupId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        return groupOpt.map(Group::getIsArchived).orElse(false);
    }

    public List<GroupDto> searchGroupsByUser(Long userId, String query) {
        List<Group> groups = groupRepository.findGroupsByUserId(userId);
        return groups.stream()
                .filter(group -> group.getName().toLowerCase().contains(query.toLowerCase()) ||
                        (group.getDescription() != null &&
                                group.getDescription().toLowerCase().contains(query.toLowerCase())))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void archiveGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.setIsArchived(true);
        groupRepository.save(group);
    }

    public void unarchiveGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.setIsArchived(false);
        groupRepository.save(group);
    }

    public GroupDto convertToDto(Group group) {
        GroupDto dto = new GroupDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setCreatedById(group.getCreatedBy().getId());
        dto.setMemberIds(group.getMembers().stream()
                .map(User::getId)
                .collect(Collectors.toSet()));

        // Set enhanced fields
        dto.setIconUrl(group.getIconUrl());
        dto.setIconName(group.getIconName());
        dto.setCoverImageUrl(group.getCoverImageUrl());
        dto.setDefaultCurrency(group.getDefaultCurrency());
        dto.setGroupType(group.getGroupType());
        dto.setPrivacyLevel(group.getPrivacyLevel());
        dto.setIsActive(group.getIsActive());
        dto.setIsArchived(group.getIsArchived());
        dto.setSimplifyDebts(group.getSimplifyDebts());
        dto.setAutoSettle(group.getAutoSettle());
        dto.setAllowMemberAddExpense(group.getAllowMemberAddExpense());
        dto.setAllowMemberEditExpense(group.getAllowMemberEditExpense());
        dto.setRequireApprovalForExpense(group.getRequireApprovalForExpense());
        dto.setNotificationEnabled(group.getNotificationEnabled());

        return dto;
    }

    public GroupDto addMemberToGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        group.addMember(user);
        Group savedGroup = groupRepository.save(group);
        return convertToDto(savedGroup);
    }

    public GroupDto removeMemberFromGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.equals(group.getCreatedBy())) {
            throw new RuntimeException("Cannot remove group creator");
        }

        group.removeMember(user);
        Group savedGroup = groupRepository.save(group);
        return convertToDto(savedGroup);
    }
}
