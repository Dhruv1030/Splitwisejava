package com.splitwise.service;

import com.splitwise.dto.ContactDto;
import com.splitwise.model.Contact;
import com.splitwise.model.User;
import com.splitwise.repository.ContactRepository;
import com.splitwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all contacts for a user
    public List<ContactDto> getUserContacts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> contacts = contactRepository.findByUserOrderByAddedAtDesc(user);
        return contacts.stream()
                .map(ContactDto::new)
                .collect(Collectors.toList());
    }

    // Get friends (accepted contacts) for a user
    public List<ContactDto> getUserFriends(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> friends = contactRepository.findByUserAndStatusAndIsBlockedOrderByAddedAtDesc(
                user, Contact.ContactStatus.ACCEPTED, false);
        return friends.stream()
                .map(ContactDto::new)
                .collect(Collectors.toList());
    }

    // Get pending invitations sent by user
    public List<ContactDto> getPendingInvitations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> pending = contactRepository.findByUserAndStatusOrderByAddedAtDesc(
                user, Contact.ContactStatus.PENDING);
        return pending.stream()
                .map(ContactDto::new)
                .collect(Collectors.toList());
    }

    // Get pending invitations received by user
    public List<ContactDto> getReceivedInvitations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> received = contactRepository.findByContactUserAndStatus(
                user, Contact.ContactStatus.PENDING);
        return received.stream()
                .map(ContactDto::new)
                .collect(Collectors.toList());
    }

    // Add contact by user ID
    public ContactDto addContactByUserId(Long userId, Long contactUserId, Contact.RelationshipType relationshipType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User contactUser = userRepository.findById(contactUserId)
                .orElseThrow(() -> new RuntimeException("Contact user not found"));

        // Check if contact already exists
        Optional<Contact> existingContact = contactRepository.findByUserAndContactUser(user, contactUser);
        if (existingContact.isPresent()) {
            throw new RuntimeException("Contact already exists");
        }

        // Prevent self-adding
        if (userId.equals(contactUserId)) {
            throw new RuntimeException("Cannot add yourself as a contact");
        }

        Contact contact = new Contact(user, contactUser);
        contact.setRelationshipType(relationshipType);
        contact = contactRepository.save(contact);

        return new ContactDto(contact);
    }

    // Add contact by email
    public ContactDto addContactByEmail(Long userId, String contactEmail, String contactName,
            Contact.RelationshipType relationshipType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if contact already exists
        Optional<Contact> existingContact = contactRepository.findByUserAndContactEmail(user, contactEmail);
        if (existingContact.isPresent()) {
            throw new RuntimeException("Contact with this email already exists");
        }

        // Check if email belongs to a registered user
        Optional<User> registeredUser = userRepository.findByEmail(contactEmail);

        Contact contact;
        if (registeredUser.isPresent()) {
            // User is registered, create contact with user reference
            contact = new Contact(user, registeredUser.get());
        } else {
            // User not registered, create contact with email
            contact = new Contact(user, contactName, contactEmail);
        }

        contact.setRelationshipType(relationshipType);
        contact = contactRepository.save(contact);

        return new ContactDto(contact);
    }

    // Accept contact invitation
    public ContactDto acceptInvitation(Long userId, Long contactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Verify this is a pending invitation to the user
        if (!contact.getContactUser().getId().equals(userId) ||
                contact.getStatus() != Contact.ContactStatus.PENDING) {
            throw new RuntimeException("Invalid invitation");
        }

        contact.setStatus(Contact.ContactStatus.ACCEPTED);
        contact = contactRepository.save(contact);

        // Create reciprocal contact
        createReciprocalContact(contact.getContactUser(), contact.getUser(), contact.getRelationshipType());

        return new ContactDto(contact);
    }

    // Decline contact invitation
    public void declineInvitation(Long userId, Long contactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Verify this is a pending invitation to the user
        if (!contact.getContactUser().getId().equals(userId) ||
                contact.getStatus() != Contact.ContactStatus.PENDING) {
            throw new RuntimeException("Invalid invitation");
        }

        contact.setStatus(Contact.ContactStatus.DECLINED);
        contactRepository.save(contact);
    }

    // Block contact
    public ContactDto blockContact(Long userId, Long contactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        contact.setIsBlocked(true);
        contact.setStatus(Contact.ContactStatus.BLOCKED);
        contact = contactRepository.save(contact);

        return new ContactDto(contact);
    }

    // Unblock contact
    public ContactDto unblockContact(Long userId, Long contactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        contact.setIsBlocked(false);
        contact.setStatus(Contact.ContactStatus.ACCEPTED);
        contact = contactRepository.save(contact);

        return new ContactDto(contact);
    }

    // Remove contact
    public void removeContact(Long userId, Long contactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        // Remove reciprocal contact if exists
        if (contact.getContactUser() != null) {
            Optional<Contact> reciprocal = contactRepository.findByUserAndContactUser(
                    contact.getContactUser(), contact.getUser());
            reciprocal.ifPresent(contactRepository::delete);
        }

        contactRepository.delete(contact);
    }

    // Search contacts
    public List<ContactDto> searchContacts(Long userId, String searchTerm) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> contacts = contactRepository.searchContacts(user, searchTerm);
        return contacts.stream()
                .map(ContactDto::new)
                .collect(Collectors.toList());
    }

    // Get blocked contacts
    public List<ContactDto> getBlockedContacts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> blocked = contactRepository.findByUserAndIsBlockedOrderByUpdatedAtDesc(user, true);
        return blocked.stream()
                .map(ContactDto::new)
                .collect(Collectors.toList());
    }

    // Get friends count
    public Long getFriendsCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return contactRepository.countFriends(user, Contact.ContactStatus.ACCEPTED);
    }

    // Helper method to create reciprocal contact
    private void createReciprocalContact(User user, User contactUser, Contact.RelationshipType relationshipType) {
        // Check if reciprocal contact already exists
        Optional<Contact> existing = contactRepository.findByUserAndContactUser(user, contactUser);
        if (existing.isEmpty()) {
            Contact reciprocal = new Contact(user, contactUser);
            reciprocal.setStatus(Contact.ContactStatus.ACCEPTED);
            reciprocal.setRelationshipType(relationshipType);
            contactRepository.save(reciprocal);
        }
    }

    // Update contact relationship type
    public ContactDto updateContactRelationship(Long userId, Long contactId,
            Contact.RelationshipType relationshipType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        contact.setRelationshipType(relationshipType);
        contact = contactRepository.save(contact);

        return new ContactDto(contact);
    }
}
