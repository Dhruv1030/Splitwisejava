package com.splitwise.dto;

import com.splitwise.model.Group;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class GroupDto {

    private Long id;

    @NotBlank(message = "Group name is required")
    @Size(min = 1, max = 100, message = "Group name must be between 1 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private Long createdById;
    private Set<Long> memberIds;

    // Enhanced Group Fields
    private String iconUrl;
    private String iconName;
    private String coverImageUrl;
    private String defaultCurrency;
    private Group.GroupType groupType;
    private Group.PrivacyLevel privacyLevel;
    private Boolean isActive;
    private Boolean isArchived;
    private Boolean simplifyDebts;
    private Boolean autoSettle;
    private Boolean allowMemberAddExpense;
    private Boolean allowMemberEditExpense;
    private Boolean requireApprovalForExpense;
    private Boolean notificationEnabled;

    // Constructors
    public GroupDto() {
    }

    public GroupDto(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public Set<Long> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(Set<Long> memberIds) {
        this.memberIds = memberIds;
    }

    // Enhanced Group Fields - Getters and Setters
    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getDefaultCurrency() {
        return defaultCurrency;
    }

    public void setDefaultCurrency(String defaultCurrency) {
        this.defaultCurrency = defaultCurrency;
    }

    public Group.GroupType getGroupType() {
        return groupType;
    }

    public void setGroupType(Group.GroupType groupType) {
        this.groupType = groupType;
    }

    public Group.PrivacyLevel getPrivacyLevel() {
        return privacyLevel;
    }

    public void setPrivacyLevel(Group.PrivacyLevel privacyLevel) {
        this.privacyLevel = privacyLevel;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsArchived() {
        return isArchived;
    }

    public void setIsArchived(Boolean isArchived) {
        this.isArchived = isArchived;
    }

    public Boolean getSimplifyDebts() {
        return simplifyDebts;
    }

    public void setSimplifyDebts(Boolean simplifyDebts) {
        this.simplifyDebts = simplifyDebts;
    }

    public Boolean getAutoSettle() {
        return autoSettle;
    }

    public void setAutoSettle(Boolean autoSettle) {
        this.autoSettle = autoSettle;
    }

    public Boolean getAllowMemberAddExpense() {
        return allowMemberAddExpense;
    }

    public void setAllowMemberAddExpense(Boolean allowMemberAddExpense) {
        this.allowMemberAddExpense = allowMemberAddExpense;
    }

    public Boolean getAllowMemberEditExpense() {
        return allowMemberEditExpense;
    }

    public void setAllowMemberEditExpense(Boolean allowMemberEditExpense) {
        this.allowMemberEditExpense = allowMemberEditExpense;
    }

    public Boolean getRequireApprovalForExpense() {
        return requireApprovalForExpense;
    }

    public void setRequireApprovalForExpense(Boolean requireApprovalForExpense) {
        this.requireApprovalForExpense = requireApprovalForExpense;
    }

    public Boolean getNotificationEnabled() {
        return notificationEnabled;
    }

    public void setNotificationEnabled(Boolean notificationEnabled) {
        this.notificationEnabled = notificationEnabled;
    }
}
