package com.tracker.expense;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepo expenseRepo;
    // Filters down the database rows to only match the logged-in user
    public List<Expense> getAllExpenseByUserId(Long userId) {
        return expenseRepo.findByUserId(userId);
    }

    public Expense createExpense(Expense expense) {
        return expenseRepo.save(expense);
    }
//CONSTRUCTOR
    public ExpenseService(@Autowired ExpenseRepo expenseRepo){
        this.expenseRepo = expenseRepo;
    }
}
