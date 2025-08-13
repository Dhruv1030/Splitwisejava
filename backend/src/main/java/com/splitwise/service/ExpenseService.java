package com.splitwise.service;

import com.splitwise.dto.ExpenseDto;
import com.splitwise.dto.ExpenseShareDto;
import com.splitwise.model.Expense;
import com.splitwise.model.ExpenseShare;
import com.splitwise.model.Group;
import com.splitwise.model.User;
import com.splitwise.repository.ExpenseRepository;
import com.splitwise.repository.ExpenseShareRepository;
import com.splitwise.repository.GroupRepository;
import com.splitwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseShareRepository expenseShareRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public Expense createExpense(ExpenseDto expenseDto) {
        User paidBy = userRepository.findById(expenseDto.getPaidById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = groupRepository.findById(expenseDto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Expense expense = new Expense(
                expenseDto.getDescription(),
                expenseDto.getAmount(),
                paidBy,
                group,
                expenseDto.getSplitType()
        );

        expense = expenseRepository.save(expense);

        // Create expense shares based on split type
        createExpenseShares(expense, expenseDto);

        return expense;
    }

    private void createExpenseShares(Expense expense, ExpenseDto expenseDto) {
        Set<User> groupMembers = expense.getGroup().getMembers();
        BigDecimal totalAmount = expense.getAmount();

        switch (expense.getSplitType()) {
            case EQUAL:
                createEqualShares(expense, groupMembers, totalAmount);
                break;
            case PERCENTAGE:
                createPercentageShares(expense, expenseDto.getShares(), totalAmount);
                break;
            case CUSTOM:
                createCustomShares(expense, expenseDto.getShares());
                break;
        }
    }

    private void createEqualShares(Expense expense, Set<User> members, BigDecimal totalAmount) {
        BigDecimal shareAmount = totalAmount.divide(BigDecimal.valueOf(members.size()), 2, RoundingMode.HALF_UP);
        
        for (User member : members) {
            ExpenseShare share = new ExpenseShare(expense, member, shareAmount);
            expense.addShare(share);
        }
    }

    private void createPercentageShares(Expense expense, Set<ExpenseShareDto> shareDtos, BigDecimal totalAmount) {
        if (shareDtos == null || shareDtos.isEmpty()) {
            throw new RuntimeException("Percentage shares must be specified");
        }

        for (ExpenseShareDto shareDto : shareDtos) {
            User user = userRepository.findById(shareDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + shareDto.getUserId()));

            BigDecimal shareAmount = totalAmount.multiply(shareDto.getPercentage())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            ExpenseShare share = new ExpenseShare(expense, user, shareAmount, shareDto.getPercentage());
            expense.addShare(share);
        }
    }

    private void createCustomShares(Expense expense, Set<ExpenseShareDto> shareDtos) {
        if (shareDtos == null || shareDtos.isEmpty()) {
            throw new RuntimeException("Custom shares must be specified");
        }

        for (ExpenseShareDto shareDto : shareDtos) {
            User user = userRepository.findById(shareDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + shareDto.getUserId()));

            ExpenseShare share = new ExpenseShare(expense, user, shareDto.getAmount());
            expense.addShare(share);
        }
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public List<Expense> getExpensesByGroupId(Long groupId) {
        return expenseRepository.findExpensesByGroupId(groupId);
    }

    public List<Expense> getExpensesByUserId(Long userId) {
        return expenseRepository.findExpensesByUserId(userId);
    }

    public Expense updateExpense(Long id, ExpenseDto expenseDto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (expenseDto.getDescription() != null) {
            expense.setDescription(expenseDto.getDescription());
        }

        if (expenseDto.getAmount() != null) {
            expense.setAmount(expenseDto.getAmount());
        }

        if (expenseDto.getSplitType() != null) {
            expense.setSplitType(expenseDto.getSplitType());
        }

        // Clear existing shares and recreate them
        expense.getShares().clear();
        createExpenseShares(expense, expenseDto);

        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public BigDecimal getTotalOwedByUser(Long userId) {
        return expenseShareRepository.getTotalOwedByUser(userId);
    }

    public List<ExpenseShare> getOwedExpensesByUser(Long userId) {
        return expenseShareRepository.findOwedExpensesByUserId(userId);
    }
}
