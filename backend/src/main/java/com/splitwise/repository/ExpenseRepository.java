package com.splitwise.repository;

import com.splitwise.model.Expense;
import com.splitwise.model.Group;
import com.splitwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByGroup(Group group);

    List<Expense> findByPaidBy(User user);

    List<Expense> findByGroupOrderByDateDesc(Group group);

    @Query("SELECT e FROM Expense e JOIN e.shares s WHERE s.user.id = :userId")
    List<Expense> findExpensesByUserId(@Param("userId") Long userId);

    @Query("SELECT e FROM Expense e WHERE e.group.id = :groupId ORDER BY e.date DESC")
    List<Expense> findExpensesByGroupId(@Param("groupId") Long groupId);
}
