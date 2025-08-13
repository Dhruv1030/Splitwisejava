package com.splitwise.repository;

import com.splitwise.model.ExpenseShare;
import com.splitwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseShareRepository extends JpaRepository<ExpenseShare, Long> {

    List<ExpenseShare> findByUser(User user);

    @Query("SELECT es FROM ExpenseShare es WHERE es.user.id = :userId AND es.amount > 0")
    List<ExpenseShare> findOwedExpensesByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(es.amount), 0) FROM ExpenseShare es WHERE es.user.id = :userId")
    BigDecimal getTotalOwedByUser(@Param("userId") Long userId);

    @Query("SELECT es FROM ExpenseShare es WHERE es.expense.id = :expenseId")
    List<ExpenseShare> findByExpenseId(@Param("expenseId") Long expenseId);
}
