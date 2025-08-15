package com.splitwise.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/docs")
@CrossOrigin(origins = "*")
public class ApiDocumentationController {

    @GetMapping
    public Map<String, Object> getApiDocumentation() {
        Map<String, Object> docs = new HashMap<>();

        docs.put("title", "Splitwise Clone API Documentation");
        docs.put("version", "2.0.0");
        docs.put("description", "Enhanced API with user profiles, contacts, and advanced group management");

        // User Profile API
        Map<String, Object> profileApi = new HashMap<>();
        profileApi.put("basePath", "/api/profile");
        Map<String, String> profileEndpoints = new HashMap<>();
        profileEndpoints.put("GET /", "Get current user's profile");
        profileEndpoints.put("PUT /", "Update user profile");
        profileEndpoints.put("PUT /avatar", "Update user avatar");
        profileEndpoints.put("PUT /notifications", "Update notification preferences");
        profileEndpoints.put("PUT /settings", "Update account settings");
        profileEndpoints.put("GET /{userId}", "Get public user profile");
        profileEndpoints.put("POST /last-login", "Update last login time");
        profileEndpoints.put("GET /stats", "Get user statistics");
        profileEndpoints.put("DELETE /", "Deactivate account (soft delete)");
        profileApi.put("endpoints", profileEndpoints);
        docs.put("userProfile", profileApi);

        // Contacts/Friends API
        Map<String, Object> contactsApi = new HashMap<>();
        contactsApi.put("basePath", "/api/contacts");
        Map<String, String> contactEndpoints = new HashMap<>();
        contactEndpoints.put("GET /", "Get all contacts for current user");
        contactEndpoints.put("GET /friends", "Get friends (accepted contacts)");
        contactEndpoints.put("GET /pending-sent", "Get pending invitations sent");
        contactEndpoints.put("GET /pending-received", "Get pending invitations received");
        contactEndpoints.put("POST /add-user/{contactUserId}", "Add contact by user ID");
        contactEndpoints.put("POST /add-email", "Add contact by email");
        contactEndpoints.put("POST /{contactId}/accept", "Accept contact invitation");
        contactEndpoints.put("POST /{contactId}/decline", "Decline contact invitation");
        contactEndpoints.put("POST /{contactId}/block", "Block contact");
        contactEndpoints.put("POST /{contactId}/unblock", "Unblock contact");
        contactEndpoints.put("DELETE /{contactId}", "Remove contact");
        contactEndpoints.put("GET /search", "Search contacts");
        contactEndpoints.put("GET /blocked", "Get blocked contacts");
        contactEndpoints.put("GET /friends/count", "Get friends count");
        contactEndpoints.put("PUT /{contactId}/relationship", "Update contact relationship type");
        contactsApi.put("endpoints", contactEndpoints);
        docs.put("contacts", contactsApi);

        // Enhanced Groups API
        Map<String, Object> groupsApi = new HashMap<>();
        groupsApi.put("basePath", "/api/groups");
        Map<String, String> groupEndpoints = new HashMap<>();
        groupEndpoints.put("GET /", "Get all groups for current user");
        groupEndpoints.put("GET /{groupId}", "Get group by ID with enhanced details");
        groupEndpoints.put("POST /", "Create new group with enhanced features");
        groupEndpoints.put("PUT /{groupId}/settings", "Update group settings");
        groupEndpoints.put("PUT /{groupId}/permissions", "Update group permissions");
        groupEndpoints.put("POST /{groupId}/members", "Add member to group");
        groupEndpoints.put("DELETE /{groupId}/members/{memberId}", "Remove member from group");
        groupEndpoints.put("GET /{groupId}/members", "Get group members");
        groupEndpoints.put("POST /{groupId}/archive", "Archive group");
        groupEndpoints.put("POST /{groupId}/unarchive", "Unarchive group");
        groupEndpoints.put("GET /{groupId}/stats", "Get group statistics");
        groupEndpoints.put("GET /search", "Search groups");
        groupsApi.put("endpoints", groupEndpoints);
        docs.put("groups", groupsApi);

        // Authentication API (existing)
        Map<String, Object> authApi = new HashMap<>();
        authApi.put("basePath", "/api/auth");
        authApi.put("endpoints", Map.of(
                "POST /login", "User login",
                "POST /register", "User registration"));
        docs.put("authentication", authApi);

        // Features Overview
        Map<String, Object> features = new HashMap<>();
        features.put("userProfiles", "Enhanced user profiles with avatars, preferences, and settings");
        features.put("contacts", "Complete friends/contacts system with invitations and blocking");
        features.put("groups", "Advanced group management with icons, permissions, and settings");
        features.put("security", "JWT-based authentication with role-based access control");
        docs.put("features", features);

        return docs;
    }
}
