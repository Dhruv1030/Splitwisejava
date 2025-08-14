package com.splitwise.repository;

import com.splitwise.model.Contact;
import com.splitwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    // Find all contacts for a user
    List<Contact> findByUserOrderByAddedAtDesc(User user);

    // Find contacts by status
    List<Contact> findByUserAndStatusOrderByAddedAtDesc(User user, Contact.ContactStatus status);

    // Find contacts by relationship type
    List<Contact> findByUserAndRelationshipTypeOrderByAddedAtDesc(User user, Contact.RelationshipType relationshipType);

    // Find accepted contacts (friends)
    List<Contact> findByUserAndStatusAndIsBlockedOrderByAddedAtDesc(User user, Contact.ContactStatus status, Boolean isBlocked);

    // Search contacts by name or email
    @Query("SELECT c FROM Contact c WHERE c.user = :user AND " +
           "(LOWER(c.contactName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.contactEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "(c.contactUser IS NOT NULL AND (LOWER(c.contactUser.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.contactUser.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.contactUser.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))))")
    List<Contact> searchContacts(@Param("user") User user, @Param("searchTerm") String searchTerm);

    // Check if contact exists between two users
    Optional<Contact> findByUserAndContactUser(User user, User contactUser);

    // Check if contact exists by email
    Optional<Contact> findByUserAndContactEmail(User user, String contactEmail);

    // Find mutual connections (friends of friends)
    @Query("SELECT c FROM Contact c WHERE c.contactUser IN " +
           "(SELECT c2.contactUser FROM Contact c2 WHERE c2.user = :user AND c2.status = :status) " +
           "AND c.user != :user AND c.status = :status")
    List<Contact> findMutualConnections(@Param("user") User user, @Param("status") Contact.ContactStatus status);

    // Find pending invitations sent by user
    List<Contact> findByUserAndStatusAndContactUserIsNotNull(User user, Contact.ContactStatus status);

    // Find pending invitations received by user (where user is the contactUser)
    List<Contact> findByContactUserAndStatus(User contactUser, Contact.ContactStatus status);

    // Count friends for user
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.user = :user AND c.status = :status AND c.isBlocked = false")
    Long countFriends(@Param("user") User user, @Param("status") Contact.ContactStatus status);

    // Find blocked contacts
    List<Contact> findByUserAndIsBlockedOrderByUpdatedAtDesc(User user, Boolean isBlocked);

    // Check if user is blocked by another user
    @Query("SELECT c FROM Contact c WHERE c.user = :contactUser AND c.contactUser = :user AND c.isBlocked = true")
    Optional<Contact> findBlockedContact(@Param("user") User user, @Param("contactUser") User contactUser);

    // Find contacts that are registered users
    List<Contact> findByUserAndContactUserIsNotNullOrderByAddedAtDesc(User user);

    // Find contacts that are not registered users (email only)
    List<Contact> findByUserAndContactUserIsNullOrderByAddedAtDesc(User user);
}
