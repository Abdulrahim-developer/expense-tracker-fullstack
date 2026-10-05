package com.tracker.expense;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = {"http://localhost", "http://localhost:5173"})
public class ExpenseController {
    @Autowired
    private  UserRepository userRepository;

    @Autowired
    private ExpenseRepo expenseRepo;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpense(@RequestHeader("X-User-Id") Long userId){
        List<Expense> expenses= expenseService.getAllExpenseByUserId(userId);

        return ResponseEntity.ok(expenses);
    }

    @PostMapping
            public ResponseEntity<Expense> createExpense(@RequestHeader("X-User-Id")Long userId,@RequestBody Expense expense){

                    User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));

                    expense.setUser(user);

                    Expense savedExpense = expenseService.createExpense(expense);
                    return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
    }

    @DeleteMapping("/{id}")
            public ResponseEntity<?> deleteExpense(
                    @PathVariable Long id,
                    @RequestHeader("X-User-Id") Long userId,
                    @RequestHeader("X-Delete-Password") String deletePassword
    ){
        // Find the user to get their stored hashed password
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not Found"));

        // Use BCrypt to verify if the entered password matches the database hash
        if(!passwordEncoder.matches(deletePassword,user.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Incorrect Password");
        }

        // Fetch the expense to verify ownership before deleting
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense record not found"));

        // 3. FIXED: Added strict verification validation check to ensure user owns this record
        if(!expense.getUser().getId().equals(userId)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: You do not have permission to delete this record");
        }

        expenseRepo.deleteById(id);
        return ResponseEntity.ok("Successfully Deleted");

    }




    ExpenseController(@Autowired ExpenseService expenseService ){
        this.expenseService = expenseService;
    }

}


