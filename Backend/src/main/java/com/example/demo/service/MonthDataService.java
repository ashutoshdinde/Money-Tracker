package com.example.demo.service;

import com.example.demo.domain.Category;
import com.example.demo.domain.Expense;
import com.example.demo.domain.Investment;
import com.example.demo.domain.MonthData;
import com.example.demo.domain.RecurringExpense;
import com.example.demo.dto.MonthDataRequest;
import com.example.demo.dto.MonthDataResponse;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.InvestmentRepository;
import com.example.demo.repository.MonthDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MonthDataService {

    private final MonthDataRepository monthDataRepository;
    private final ExpenseRepository expenseRepository;
    private final InvestmentRepository investmentRepository;
    private final CategoryRepository categoryRepository;

    public MonthDataService(
            MonthDataRepository monthDataRepository,
            ExpenseRepository expenseRepository,
            InvestmentRepository investmentRepository,
            CategoryRepository categoryRepository
    ) {
        this.monthDataRepository = monthDataRepository;
        this.expenseRepository = expenseRepository;
        this.investmentRepository = investmentRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public MonthDataResponse getMonthData(String monthKey) {
        MonthData monthData = monthDataRepository.findById(monthKey)
                .orElseGet(() -> persistNewMonthWithDefaults(monthKey));

        List<Expense> expenses = expenseRepository.findByMonthKey(monthKey);
        List<Investment> investments = investmentRepository.findByMonthKey(monthKey);

        return MonthDataResponse.from(monthData, expenses, investments);
    }

    @Transactional
    public MonthDataResponse saveMonthData(String monthKey, MonthDataRequest request) {
        MonthData monthData = monthDataRepository.findById(monthKey)
                .orElseGet(() -> {
                    MonthData fresh = new MonthData();
                    fresh.setMonthKey(monthKey);
                    fresh.setSalary(BigDecimal.ZERO);
                    return fresh;
                });

        monthData.setSalary(request.getSalary() == null ? BigDecimal.ZERO : request.getSalary());

        monthData.getCategories().clear();
        if (request.getCategories() == null || request.getCategories().isEmpty()) {
            attachDefaultCategories(monthData);
        } else {
            mergeCategories(monthData, request.getCategories());
        }

        monthData.getRecurringExpenses().clear();
        if (request.getRecurringExpenses() != null) {
            mergeRecurringExpenses(monthData, request.getRecurringExpenses());
        }

        MonthData saved = monthDataRepository.save(monthData);
        List<Expense> expenses = expenseRepository.findByMonthKey(monthKey);
        List<Investment> investments = investmentRepository.findByMonthKey(monthKey);

        return MonthDataResponse.from(saved, expenses, investments);
    }

    private MonthData persistNewMonthWithDefaults(String monthKey) {
        MonthData monthData = new MonthData();
        monthData.setMonthKey(monthKey);
        monthData.setSalary(BigDecimal.ZERO);
        attachDefaultCategories(monthData);
        return monthDataRepository.save(monthData);
    }

    private void attachDefaultCategories(MonthData monthData) {
        addCategoryTemplate(monthData, "stocks", "Stocks");
        addCategoryTemplate(monthData, "lic", "LIC");
        addCategoryTemplate(monthData, "liquid-cash", "Liquid Cash");
        addCategoryTemplate(monthData, "other-spending", "Other Spending");
    }

    private void addCategoryTemplate(MonthData monthData, String categoryKey, String name) {
        Category category = new Category();
        category.setCategoryKey(categoryKey);
        category.setName(name);
        category.setAmount(BigDecimal.ZERO);
        category.setCustom(false);
        category.setStarred(false);
        category.setMonth(monthData);
        monthData.getCategories().add(category);
    }

    private void mergeCategories(MonthData monthData, List<Category> requestCategories) {
        for (Category reqCategory : requestCategories) {
            categoryRepository.findByMonthMonthKeyAndCategoryKey(monthData.getMonthKey(), reqCategory.getCategoryKey())
                    .ifPresentOrElse(
                            existingCategory -> {
                                existingCategory.setName(reqCategory.getName());
                                existingCategory.setAmount(reqCategory.getAmount());
                                existingCategory.setCustom(reqCategory.isCustom());
                                existingCategory.setStarred(reqCategory.isStarred());
                            },
                            () -> {
                                reqCategory.setMonth(monthData);
                                monthData.getCategories().add(reqCategory);
                            }
                    );
        }
    }

    private void mergeRecurringExpenses(MonthData monthData, List<RecurringExpense> requestRecurring) {
        for (RecurringExpense re : requestRecurring) {
            re.setMonth(monthData);
        }
        monthData.getRecurringExpenses().addAll(requestRecurring);
    }
}
