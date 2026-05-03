package com.example.demo.dto;

import com.example.demo.domain.Category;
import com.example.demo.domain.Expense;
import com.example.demo.domain.Investment;
import com.example.demo.domain.MonthData;
import com.example.demo.domain.RecurringExpense;

import java.math.BigDecimal;
import java.util.List;

public class MonthDataResponse {

    private String monthKey;
    private BigDecimal salary;
    private List<Category> categories;
    private List<RecurringExpense> recurringExpenses;
    private List<Expense> expenses;
    private List<Investment> investments;

    public static MonthDataResponse from(MonthData monthData, List<Expense> expenses, List<Investment> investments) {
        MonthDataResponse response = new MonthDataResponse();
        response.setMonthKey(monthData.getMonthKey());
        response.setSalary(monthData.getSalary());
        response.setCategories(monthData.getCategories());
        response.setRecurringExpenses(monthData.getRecurringExpenses());
        response.setExpenses(expenses);
        response.setInvestments(investments);
        return response;
    }

    public String getMonthKey() { return monthKey; }
    public void setMonthKey(String monthKey) { this.monthKey = monthKey; }
    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    public List<Category> getCategories() { return categories; }
    public void setCategories(List<Category> categories) { this.categories = categories; }
    public List<RecurringExpense> getRecurringExpenses() { return recurringExpenses; }
    public void setRecurringExpenses(List<RecurringExpense> recurringExpenses) { this.recurringExpenses = recurringExpenses; }
    public List<Expense> getExpenses() { return expenses; }
    public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }
    public List<Investment> getInvestments() { return investments; }
    public void setInvestments(List<Investment> investments) { this.investments = investments; }
}
