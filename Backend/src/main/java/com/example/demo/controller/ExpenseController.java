package com.example.demo.controller;

import com.example.demo.domain.Expense;
import com.example.demo.repository.ExpenseRepository;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @GetMapping
    public List<Expense> getAllExpenses(@RequestParam(value = "monthKey", required = false) String monthKey) {
        if (monthKey == null || monthKey.isBlank()) {
            return expenseRepository.findAll();
        }
        return expenseRepository.findByMonthKey(monthKey);
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        if (expense.getDate() == null) {
            expense.setDate(OffsetDateTime.now());
        }
        if (expense.getMonthKey() == null || expense.getMonthKey().isBlank()) {
            expense.setMonthKey(YearMonth.now().toString());
        }
        return expenseRepository.save(expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
    }
}
