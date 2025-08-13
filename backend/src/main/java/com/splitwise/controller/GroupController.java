package com.splitwise.controller;

import com.splitwise.dto.GroupDto;
import com.splitwise.model.Group;
import com.splitwise.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:4200")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping
    public ResponseEntity<Group> createGroup(@Valid @RequestBody GroupDto groupDto) {
        try {
            Group group = groupService.createGroup(groupDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(group);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Optional<Group> group = groupService.getGroupById(id);
        return group.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getGroupsByUserId(@PathVariable Long userId) {
        List<Group> groups = groupService.getGroupsByUserId(userId);
        return ResponseEntity.ok(groups);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Long id, @Valid @RequestBody GroupDto groupDto) {
        try {
            Group group = groupService.updateGroup(id, groupDto);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> addMemberToGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        try {
            Group group = groupService.addMemberToGroup(groupId, userId);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> removeMemberFromGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        try {
            Group group = groupService.removeMemberFromGroup(groupId, userId);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
