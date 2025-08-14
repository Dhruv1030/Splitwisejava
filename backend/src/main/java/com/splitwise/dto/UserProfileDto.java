package com.splitwise.dto;

import com.splitwise.model.User;

import java.time.LocalDateTime;

public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String phone;
    private String defaultCurrency;
    private String timezone;
    private String language;
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Boolean expenseNotifications;
    private Boolean settlementNotifications;
    private Boolean isVerified;
    private Boolean twoFactorEnabled;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;

    // Constructors
    public UserProfileDto() {
    }

    public UserProfileDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.avatarUrl = user.getAvatarUrl();
        this.phone = user.getPhone();
        this.defaultCurrency = user.getDefaultCurrency();
        this.timezone = user.getTimezone();
        this.language = user.getLanguage();
        this.emailNotifications = user.getEmailNotifications();
        this.pushNotifications = user.getPushNotifications();
        this.expenseNotifications = user.getExpenseNotifications();
        this.settlementNotifications = user.getSettlementNotifications();
        this.isVerified = user.getIsVerified();
        this.twoFactorEnabled = user.getTwoFactorEnabled();
        this.lastLogin = user.getLastLogin();
        this.createdAt = user.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDefaultCurrency() {
        return defaultCurrency;
    }

    public void setDefaultCurrency(String defaultCurrency) {
        this.defaultCurrency = defaultCurrency;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getPushNotifications() {
        return pushNotifications;
    }

    public void setPushNotifications(Boolean pushNotifications) {
        this.pushNotifications = pushNotifications;
    }

    public Boolean getExpenseNotifications() {
        return expenseNotifications;
    }

    public void setExpenseNotifications(Boolean expenseNotifications) {
        this.expenseNotifications = expenseNotifications;
    }

    public Boolean getSettlementNotifications() {
        return settlementNotifications;
    }

    public void setSettlementNotifications(Boolean settlementNotifications) {
        this.settlementNotifications = settlementNotifications;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Boolean getTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(Boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public String getDisplayName() {
        return username != null ? username : getFullName();
    }

    public String getInitials() {
        return (firstName != null ? firstName.substring(0, 1) : "") + 
               (lastName != null ? lastName.substring(0, 1) : "");
    }
}
