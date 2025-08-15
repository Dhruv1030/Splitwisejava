package com.splitwise.controller;

import com.splitwise.dto.GroupDto;
import com.splitwise.model.Group;
import com.splitwise.model.User;
import com.splitwise.service.GroupService;
import com.splitwise.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class EnhancedGroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    // Get all groups for current user
    @GetMapping
    public ResponseEntity<List<GroupDto>> getUserGroups() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        List<GroupDto> groups = groupService.getGroupsByUser(user.getId());
        return ResponseEntity.ok(groups);
    }

    // Get group by ID with enhanced details
    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getGroupById(@PathVariable Long groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        GroupDto group = groupService.getGroupById(groupId);

        if (group == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if user is a member of the group
        if (!groupService.isUserMemberOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(group);
    }

    // Create new group with enhanced features
    @PostMapping
    public ResponseEntity<GroupDto> createGroup(@RequestBody Map<String, Object> groupData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Extract group data
        String name = (String) groupData.get("name");
        String description = (String) groupData.get("description");
        String iconName = (String) groupData.getOrDefault("iconName", "fas fa-users");
        String iconUrl = (String) groupData.get("iconUrl");
        String coverImageUrl = (String) groupData.get("coverImageUrl");
        String defaultCurrency = (String) groupData.getOrDefault("defaultCurrency", "USD");
        Group.GroupType groupType = Group.GroupType.valueOf(
                (String) groupData.getOrDefault("groupType", "GENERAL"));
        Group.PrivacyLevel privacyLevel = Group.PrivacyLevel.valueOf(
                (String) groupData.getOrDefault("privacyLevel", "PRIVATE"));

        // Create group DTO
        GroupDto groupDto = new GroupDto();
        groupDto.setName(name);
        groupDto.setDescription(description);
        groupDto.setCreatedById(user.getId());

        // Set enhanced properties
        groupDto.setIconName(iconName);
        groupDto.setIconUrl(iconUrl);
        groupDto.setCoverImageUrl(coverImageUrl);
        groupDto.setDefaultCurrency(defaultCurrency);
        groupDto.setGroupType(groupType);
        groupDto.setPrivacyLevel(privacyLevel);

        GroupDto createdGroup = groupService.createGroup(groupDto);
        return ResponseEntity.ok(createdGroup);
    }

    // Update group settings
    @PutMapping("/{groupId}/settings")
    public ResponseEntity<GroupDto> updateGroupSettings(
            @PathVariable Long groupId,
            @RequestBody Map<String, Object> settings) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is admin of the group
        if (!groupService.isUserAdminOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        // Update group settings
        GroupDto groupDto = new GroupDto();
        groupDto.setId(groupId);

        if (settings.containsKey("name")) {
            groupDto.setName((String) settings.get("name"));
        }
        if (settings.containsKey("description")) {
            groupDto.setDescription((String) settings.get("description"));
        }
        if (settings.containsKey("iconName")) {
            groupDto.setIconName((String) settings.get("iconName"));
        }
        if (settings.containsKey("iconUrl")) {
            groupDto.setIconUrl((String) settings.get("iconUrl"));
        }
        if (settings.containsKey("coverImageUrl")) {
            groupDto.setCoverImageUrl((String) settings.get("coverImageUrl"));
        }
        if (settings.containsKey("defaultCurrency")) {
            groupDto.setDefaultCurrency((String) settings.get("defaultCurrency"));
        }
        if (settings.containsKey("groupType")) {
            groupDto.setGroupType(Group.GroupType.valueOf((String) settings.get("groupType")));
        }
        if (settings.containsKey("privacyLevel")) {
            groupDto.setPrivacyLevel(Group.PrivacyLevel.valueOf((String) settings.get("privacyLevel")));
        }

        GroupDto updatedGroup = groupService.updateGroup(groupId, groupDto);
        return ResponseEntity.ok(updatedGroup);
    }

    // Update group permissions
    @PutMapping("/{groupId}/permissions")
    public ResponseEntity<GroupDto> updateGroupPermissions(
            @PathVariable Long groupId,
            @RequestBody Map<String, Boolean> permissions) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is admin of the group
        if (!groupService.isUserAdminOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        // Update permissions
        GroupDto groupDto = new GroupDto();
        groupDto.setId(groupId);

        if (permissions.containsKey("allowMemberAddExpense")) {
            groupDto.setAllowMemberAddExpense(permissions.get("allowMemberAddExpense"));
        }
        if (permissions.containsKey("allowMemberEditExpense")) {
            groupDto.setAllowMemberEditExpense(permissions.get("allowMemberEditExpense"));
        }
        if (permissions.containsKey("requireApprovalForExpense")) {
            groupDto.setRequireApprovalForExpense(permissions.get("requireApprovalForExpense"));
        }
        if (permissions.containsKey("simplifyDebts")) {
            groupDto.setSimplifyDebts(permissions.get("simplifyDebts"));
        }
        if (permissions.containsKey("autoSettle")) {
            groupDto.setAutoSettle(permissions.get("autoSettle"));
        }
        if (permissions.containsKey("notificationEnabled")) {
            groupDto.setNotificationEnabled(permissions.get("notificationEnabled"));
        }

        GroupDto updatedGroup = groupService.updateGroup(groupId, groupDto);
        return ResponseEntity.ok(updatedGroup);
    }

    // Add member to group
    @PostMapping("/{groupId}/members")
    public ResponseEntity<Map<String, String>> addMemberToGroup(
            @PathVariable Long groupId,
            @RequestBody Map<String, Object> memberData) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is admin of the group
        if (!groupService.isUserAdminOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        Long memberId = Long.valueOf(memberData.get("memberId").toString());

        try {
            groupService.addMemberToGroup(groupId, memberId);
            Map<String, String> response = Map.of("message", "Member added successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Remove member from group
    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<Map<String, String>> removeMemberFromGroup(
            @PathVariable Long groupId,
            @PathVariable Long memberId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is admin of the group
        if (!groupService.isUserAdminOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        try {
            groupService.removeMemberFromGroup(groupId, memberId);
            Map<String, String> response = Map.of("message", "Member removed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get group members
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<User>> getGroupMembers(@PathVariable Long groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is a member of the group
        if (!groupService.isUserMemberOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        List<User> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    // Archive group
    @PostMapping("/{groupId}/archive")
    public ResponseEntity<Map<String, String>> archiveGroup(@PathVariable Long groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is admin of the group
        if (!groupService.isUserAdminOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        try {
            groupService.archiveGroup(groupId);
            Map<String, String> response = Map.of("message", "Group archived successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Unarchive group
    @PostMapping("/{groupId}/unarchive")
    public ResponseEntity<Map<String, String>> unarchiveGroup(@PathVariable Long groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is admin of the group
        if (!groupService.isUserAdminOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        try {
            groupService.unarchiveGroup(groupId);
            Map<String, String> response = Map.of("message", "Group unarchived successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get group statistics
    @GetMapping("/{groupId}/stats")
    public ResponseEntity<Map<String, Object>> getGroupStats(@PathVariable Long groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is a member of the group
        if (!groupService.isUserMemberOfGroup(user.getId(), groupId)) {
            return ResponseEntity.status(403).build();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("groupId", groupId);
        stats.put("memberCount", groupService.getGroupMemberCount(groupId));
        stats.put("expenseCount", groupService.getGroupExpenseCount(groupId));
        stats.put("totalSpent", groupService.getGroupTotalSpent(groupId));
        stats.put("isActive", groupService.isGroupActive(groupId));
        stats.put("isArchived", groupService.isGroupArchived(groupId));

        return ResponseEntity.ok(stats);
    }

    // Search groups
    @GetMapping("/search")
    public ResponseEntity<List<GroupDto>> searchGroups(@RequestParam String query) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<GroupDto> groups = groupService.searchGroupsByUser(user.getId(), query.trim());
        return ResponseEntity.ok(groups);
    }
}
