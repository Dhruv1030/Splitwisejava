package com.splitwise.controller;

import com.splitwise.dto.ContactDto;
import com.splitwise.model.Contact;
import com.splitwise.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactService contactService;

    // Get all contacts for current user
    @GetMapping
    public ResponseEntity<List<ContactDto>> getUserContacts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Get user ID from username (you might want to add a method to get user ID from
        // username)
        // For now, let's assume we can get it from the authentication context
        // This is a simplified approach - you might want to enhance this

        // For demonstration, let's use a placeholder user ID
        // In a real implementation, you'd get this from the user service
        Long userId = 1L; // This should be retrieved from the authenticated user

        List<ContactDto> contacts = contactService.getUserContacts(userId);
        return ResponseEntity.ok(contacts);
    }

    // Get friends (accepted contacts) for current user
    @GetMapping("/friends")
    public ResponseEntity<List<ContactDto>> getUserFriends() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        List<ContactDto> friends = contactService.getUserFriends(userId);
        return ResponseEntity.ok(friends);
    }

    // Get pending invitations sent by current user
    @GetMapping("/pending-sent")
    public ResponseEntity<List<ContactDto>> getPendingInvitations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        List<ContactDto> pending = contactService.getPendingInvitations(userId);
        return ResponseEntity.ok(pending);
    }

    // Get pending invitations received by current user
    @GetMapping("/pending-received")
    public ResponseEntity<List<ContactDto>> getReceivedInvitations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        List<ContactDto> received = contactService.getReceivedInvitations(userId);
        return ResponseEntity.ok(received);
    }

    // Add contact by user ID
    @PostMapping("/add-user/{contactUserId}")
    public ResponseEntity<ContactDto> addContactByUserId(
            @PathVariable Long contactUserId,
            @RequestParam(required = false, defaultValue = "FRIEND") Contact.RelationshipType relationshipType) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        try {
            ContactDto contact = contactService.addContactByUserId(userId, contactUserId, relationshipType);
            return ResponseEntity.ok(contact);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Add contact by email
    @PostMapping("/add-email")
    public ResponseEntity<ContactDto> addContactByEmail(@RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        String contactEmail = request.get("email");
        String contactName = request.get("name");
        String relationshipTypeStr = request.getOrDefault("relationshipType", "FRIEND");

        if (contactEmail == null || contactEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Contact.RelationshipType relationshipType;
        try {
            relationshipType = Contact.RelationshipType.valueOf(relationshipTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            relationshipType = Contact.RelationshipType.FRIEND;
        }

        try {
            ContactDto contact = contactService.addContactByEmail(userId, contactEmail, contactName, relationshipType);
            return ResponseEntity.ok(contact);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Accept contact invitation
    @PostMapping("/{contactId}/accept")
    public ResponseEntity<ContactDto> acceptInvitation(@PathVariable Long contactId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        try {
            ContactDto contact = contactService.acceptInvitation(userId, contactId);
            return ResponseEntity.ok(contact);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Decline contact invitation
    @PostMapping("/{contactId}/decline")
    public ResponseEntity<Map<String, String>> declineInvitation(@PathVariable Long contactId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        try {
            contactService.declineInvitation(userId, contactId);
            Map<String, String> response = Map.of("message", "Invitation declined successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Block contact
    @PostMapping("/{contactId}/block")
    public ResponseEntity<ContactDto> blockContact(@PathVariable Long contactId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        try {
            ContactDto contact = contactService.blockContact(userId, contactId);
            return ResponseEntity.ok(contact);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Unblock contact
    @PostMapping("/{contactId}/unblock")
    public ResponseEntity<ContactDto> unblockContact(@PathVariable Long contactId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        try {
            ContactDto contact = contactService.unblockContact(userId, contactId);
            return ResponseEntity.ok(contact);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Remove contact
    @DeleteMapping("/{contactId}")
    public ResponseEntity<Map<String, String>> removeContact(@PathVariable Long contactId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        try {
            contactService.removeContact(userId, contactId);
            Map<String, String> response = Map.of("message", "Contact removed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Search contacts
    @GetMapping("/search")
    public ResponseEntity<List<ContactDto>> searchContacts(@RequestParam String query) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<ContactDto> contacts = contactService.searchContacts(userId, query.trim());
        return ResponseEntity.ok(contacts);
    }

    // Get blocked contacts
    @GetMapping("/blocked")
    public ResponseEntity<List<ContactDto>> getBlockedContacts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        List<ContactDto> blocked = contactService.getBlockedContacts(userId);
        return ResponseEntity.ok(blocked);
    }

    // Get friends count
    @GetMapping("/friends/count")
    public ResponseEntity<Map<String, Long>> getFriendsCount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        Long count = contactService.getFriendsCount(userId);
        Map<String, Long> response = Map.of("friendsCount", count);
        return ResponseEntity.ok(response);
    }

    // Update contact relationship type
    @PutMapping("/{contactId}/relationship")
    public ResponseEntity<ContactDto> updateContactRelationship(
            @PathVariable Long contactId,
            @RequestParam Contact.RelationshipType relationshipType) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Long userId = 1L; // This should be retrieved from the authenticated user

        try {
            ContactDto contact = contactService.updateContactRelationship(userId, contactId, relationshipType);
            return ResponseEntity.ok(contact);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
