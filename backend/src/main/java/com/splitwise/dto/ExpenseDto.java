package com.splitwise.dto;

import com.splitwise.model.Expense;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public class ExpenseDto {

    private Long id;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private Long paidById;
    private Long groupId;
    private Expense.SplitType splitType;
    private LocalDateTime date;
    private Set<ExpenseShareDto> shares;

    // Constructors
    public ExpenseDto() {
    }

    public ExpenseDto(String description, BigDecimal amount, Long paidById, Long groupId, Expense.SplitType splitType) {
        this.description = description;
        this.amount = amount;
        this.paidById = paidById;
        this.groupId = groupId;
        this.splitType = splitType;
        this.date = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getPaidById() {
        return paidById;
    }

    public void setPaidById(Long paidById) {
        this.paidById = paidById;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Expense.SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(Expense.SplitType splitType) {
        this.splitType = splitType;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Set<ExpenseShareDto> getShares() {
        return shares;
    }

    public void setShares(Set<ExpenseShareDto> shares) {
        this.shares = shares;
    }
}
