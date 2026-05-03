package com.example.demo.repository;

import com.example.demo.domain.Investment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {
	List<Investment> findByMonthKey(String monthKey);
}
