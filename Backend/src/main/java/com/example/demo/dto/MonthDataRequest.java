package com.example.demo.dto;

import com.example.demo.domain.Category;
import com.example.demo.domain.RecurringExpense;

import java.math.BigDecimal;
import java.util.List;

public class MonthDataRequest {

    private BigDecimal salary;
    private List<Category> categories;
    private List<RecurringExpense> recurringExpenses;

    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    public List<Category> getCategories() { return categories; }
    public void setCategories(List<Category> categories) { this.categories = categories; }
    public List<RecurringExpense> getRecurringExpenses() { return recurringExpenses; }
    public void setRecurringExpenses(List<RecurringExpense> recurringExpenses) { this.recurringExpenses = recurringExpenses; }
}
