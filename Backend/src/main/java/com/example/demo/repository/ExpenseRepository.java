package com.example.demo.repository;

import com.example.demo.domain.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
	List<Expense> findByMonthKey(String monthKey);
}
