package com.example.demo.repository;

import com.example.demo.domain.MonthData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthDataRepository extends JpaRepository<MonthData, String> {
}
