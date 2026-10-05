package com.tracker.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepo extends JpaRepository<Expense,Long> {

    // Spring parses this method name to dynamically filter the table by the user's foreign key ID
    List<Expense> findByUserId(Long userId);
}
