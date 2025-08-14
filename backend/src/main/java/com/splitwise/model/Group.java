package com.splitwise.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    // Enhanced Group Fields
    @Column(name = "icon_url")
    private String iconUrl;

    @Column(name = "icon_name")
    private String iconName = "fas fa-users"; // Default icon

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "default_currency", length = 3)
    private String defaultCurrency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(name = "group_type")
    private GroupType groupType = GroupType.GENERAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "privacy_level")
    private PrivacyLevel privacyLevel = PrivacyLevel.PRIVATE;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_archived")
    private Boolean isArchived = false;

    @Column(name = "simplify_debts")
    private Boolean simplifyDebts = true;

    @Column(name = "auto_settle")
    private Boolean autoSettle = false;

    // Group Settings
    @Column(name = "allow_member_add_expense")
    private Boolean allowMemberAddExpense = true;

    @Column(name = "allow_member_edit_expense")
    private Boolean allowMemberEditExpense = false;

    @Column(name = "require_approval_for_expense")
    private Boolean requireApprovalForExpense = false;

    @Column(name = "notification_enabled")
    private Boolean notificationEnabled = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "group_members", joinColumns = @JoinColumn(name = "group_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnore
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Expense> expenses = new HashSet<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Enums
    public enum GroupType {
        GENERAL,
        TRIP,
        HOME,
        COUPLE,
        PROJECT,
        EVENT,
        OTHER
    }

    public enum PrivacyLevel {
        PRIVATE,
        INVITE_ONLY,
        PUBLIC
    }

    // Constructors
    public Group() {
    }

    public Group(String name, String description, User createdBy) {
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Set<User> getMembers() {
        return members;
    }

    public void setMembers(Set<User> members) {
        this.members = members;
    }

    public Set<Expense> getExpenses() {
        return expenses;
    }

    public void setExpenses(Set<Expense> expenses) {
        this.expenses = expenses;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper methods
    public void addMember(User user) {
        members.add(user);
        user.getGroups().add(this);
    }

    public void removeMember(User user) {
        members.remove(user);
        user.getGroups().remove(this);
    }

    public void addExpense(Expense expense) {
        expenses.add(expense);
        expense.setGroup(this);
    }

    public void removeExpense(Expense expense) {
        expenses.remove(expense);
        expense.setGroup(null);
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters for new fields
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

    public GroupType getGroupType() {
        return groupType;
    }

    public void setGroupType(GroupType groupType) {
        this.groupType = groupType;
    }

    public PrivacyLevel getPrivacyLevel() {
        return privacyLevel;
    }

    public void setPrivacyLevel(PrivacyLevel privacyLevel) {
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

    // Enhanced helper methods
    public boolean isAdmin(User user) {
        return createdBy != null && createdBy.getId().equals(user.getId());
    }

    public boolean isMember(User user) {
        return members.stream().anyMatch(member -> member.getId().equals(user.getId()));
    }

    public int getMemberCount() {
        return members.size();
    }

    public String getDisplayIcon() {
        return iconUrl != null ? iconUrl : iconName;
    }

    public boolean canUserAddExpense(User user) {
        return isMember(user) && (allowMemberAddExpense || isAdmin(user));
    }

    public boolean canUserEditExpense(User user) {
        return isMember(user) && (allowMemberEditExpense || isAdmin(user));
    }

    public boolean isActive() {
        return isActive != null && isActive && (isArchived == null || !isArchived);
    }
}
