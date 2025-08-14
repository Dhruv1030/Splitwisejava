package com.splitwise.dto;

import com.splitwise.model.Contact;

import java.time.LocalDateTime;

public class ContactDto {
    private Long id;
    private Long userId;
    private UserProfileDto contactUser;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private Contact.ContactStatus status;
    private Contact.RelationshipType relationshipType;
    private Boolean isBlocked;
    private LocalDateTime addedAt;
    private Boolean isRegisteredUser;

    // Constructors
    public ContactDto() {
    }

    public ContactDto(Contact contact) {
        this.id = contact.getId();
        this.userId = contact.getUser().getId();
        
        if (contact.getContactUser() != null) {
            this.contactUser = new UserProfileDto(contact.getContactUser());
            this.isRegisteredUser = true;
        } else {
            this.contactName = contact.getContactName();
            this.contactEmail = contact.getContactEmail();
            this.contactPhone = contact.getContactPhone();
            this.isRegisteredUser = false;
        }
        
        this.status = contact.getStatus();
        this.relationshipType = contact.getRelationshipType();
        this.isBlocked = contact.getIsBlocked();
        this.addedAt = contact.getAddedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public UserProfileDto getContactUser() {
        return contactUser;
    }

    public void setContactUser(UserProfileDto contactUser) {
        this.contactUser = contactUser;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public Contact.ContactStatus getStatus() {
        return status;
    }

    public void setStatus(Contact.ContactStatus status) {
        this.status = status;
    }

    public Contact.RelationshipType getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(Contact.RelationshipType relationshipType) {
        this.relationshipType = relationshipType;
    }

    public Boolean getIsBlocked() {
        return isBlocked;
    }

    public void setIsBlocked(Boolean isBlocked) {
        this.isBlocked = isBlocked;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public Boolean getIsRegisteredUser() {
        return isRegisteredUser;
    }

    public void setIsRegisteredUser(Boolean isRegisteredUser) {
        this.isRegisteredUser = isRegisteredUser;
    }

    // Helper methods
    public String getDisplayName() {
        if (contactUser != null) {
            return contactUser.getFullName();
        }
        return contactName;
    }

    public String getDisplayEmail() {
        if (contactUser != null) {
            return contactUser.getEmail();
        }
        return contactEmail;
    }

    public String getAvatarUrl() {
        if (contactUser != null) {
            return contactUser.getAvatarUrl();
        }
        return null;
    }

    public String getInitials() {
        if (contactUser != null) {
            return contactUser.getInitials();
        }
        if (contactName != null && !contactName.isEmpty()) {
            String[] parts = contactName.split(" ");
            return (parts.length > 0 ? parts[0].substring(0, 1) : "") +
                   (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) : "");
        }
        return "";
    }

    public boolean isPending() {
        return status == Contact.ContactStatus.PENDING;
    }

    public boolean isAccepted() {
        return status == Contact.ContactStatus.ACCEPTED;
    }

    public boolean isBlocked() {
        return isBlocked != null && isBlocked;
    }
}
