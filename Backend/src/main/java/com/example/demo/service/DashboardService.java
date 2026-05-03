package com.example.demo.service;

import com.example.demo.domain.Category;
import com.example.demo.domain.Expense;
import com.example.demo.domain.Investment;
import com.example.demo.domain.MonthData;
import com.example.demo.dto.DashboardDTO;
import com.example.demo.dto.StarredCategoryMonthDto;
import com.example.demo.dto.StarredCategorySummaryDto;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.InvestmentRepository;
import com.example.demo.repository.MonthDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final InvestmentRepository investmentRepository;
    private final ExpenseRepository expenseRepository;
    private final MonthDataRepository monthDataRepository;

    public DashboardService(
            InvestmentRepository investmentRepository,
            ExpenseRepository expenseRepository,
            MonthDataRepository monthDataRepository
    ) {
        this.investmentRepository = investmentRepository;
        this.expenseRepository = expenseRepository;
        this.monthDataRepository = monthDataRepository;
    }

    public DashboardDTO getDashboardData() {
        BigDecimal totalAllocated = investmentRepository.findAll().stream()
                .map(Investment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSpent = expenseRepository.findAll().stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netSavings = totalAllocated.subtract(totalSpent);

        return new DashboardDTO(totalAllocated, totalSpent, netSavings);
    }

    @Transactional
    public List<StarredCategorySummaryDto> getStarredCategoryAllocationTotals() {
        List<MonthData> months = monthDataRepository.findAll();
        months.sort(Comparator.comparing(MonthData::getMonthKey));

        Map<String, StarredCategorySummaryDto> byCategoryId = new LinkedHashMap<>();

        for (MonthData month : months) {
            String monthKey = month.getMonthKey();
            if (month.getCategories() == null) {
                continue;
            }
            for (Category cat : month.getCategories()) {
                if (!cat.isStarred()) {
                    continue;
                }
                BigDecimal allocated = cat.getAmount() == null ? BigDecimal.ZERO : cat.getAmount();

                StarredCategorySummaryDto summary = byCategoryId.computeIfAbsent(cat.getCategoryKey(), key -> {
                    StarredCategorySummaryDto dto = new StarredCategorySummaryDto();
                    dto.setCategoryId(cat.getCategoryKey());
                    dto.setCategoryName(cat.getName());
                    dto.setTotalAllocated(BigDecimal.ZERO);
                    dto.setByMonth(new ArrayList<>());
                    return dto;
                });

                if (summary.getCategoryName() == null || summary.getCategoryName().isBlank()) {
                    summary.setCategoryName(cat.getName());
                }

                summary.setTotalAllocated(summary.getTotalAllocated().add(allocated));
                summary.getByMonth().add(new StarredCategoryMonthDto(monthKey, allocated));
            }
        }

        return new ArrayList<>(byCategoryId.values());
    }
}
