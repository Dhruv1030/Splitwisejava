package com.splitwise.controller;

import com.splitwise.dto.ExpenseDto;
import com.splitwise.model.Expense;
import com.splitwise.model.ExpenseShare;
import com.splitwise.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody ExpenseDto expenseDto) {
        try {
            Expense expense = expenseService.createExpense(expenseDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(expense);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        Optional<Expense> expense = expenseService.getExpenseById(id);
        return expense.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getExpensesByGroupId(@PathVariable Long groupId) {
        List<Expense> expenses = expenseService.getExpensesByGroupId(groupId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByUserId(@PathVariable Long userId) {
        List<Expense> expenses = expenseService.getExpensesByUserId(userId);
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @Valid @RequestBody ExpenseDto expenseDto) {
        try {
            Expense expense = expenseService.updateExpense(id, expenseDto);
            return ResponseEntity.ok(expense);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/owed")
    public ResponseEntity<BigDecimal> getTotalOwedByUser(@PathVariable Long userId) {
        BigDecimal totalOwed = expenseService.getTotalOwedByUser(userId);
        return ResponseEntity.ok(totalOwed);
    }

    @GetMapping("/user/{userId}/shares")
    public ResponseEntity<List<ExpenseShare>> getOwedExpensesByUser(@PathVariable Long userId) {
        List<ExpenseShare> shares = expenseService.getOwedExpensesByUser(userId);
        return ResponseEntity.ok(shares);
    }
}
