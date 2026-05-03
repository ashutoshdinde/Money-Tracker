package com.example.demo.controller;

import com.example.demo.domain.Investment;
import com.example.demo.repository.InvestmentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    private final InvestmentRepository investmentRepository;

    public InvestmentController(InvestmentRepository investmentRepository) {
        this.investmentRepository = investmentRepository;
    }

    @GetMapping
    public List<Investment> getAllInvestments(@RequestParam(value = "monthKey", required = false) String monthKey) {
        if (monthKey == null || monthKey.isBlank()) {
            return investmentRepository.findAll();
        }
        return investmentRepository.findByMonthKey(monthKey);
    }

    @PostMapping
    public Investment createInvestment(@RequestBody Investment investment) {
        if (investment.getMonthKey() == null || investment.getMonthKey().isBlank()) {
            investment.setMonthKey(YearMonth.now().toString());
        }
        return investmentRepository.save(investment);
    }

    @DeleteMapping("/{id}")
    public void deleteInvestment(@PathVariable Long id) {
        investmentRepository.deleteById(id);
    }
}
