package com.example.demo.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "month_data")
public class MonthData {

    @Id
    @Column(name = "month_key")
    private String monthKey;
    private BigDecimal salary;

    @OneToMany(
            mappedBy = "month",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<Category> categories = new ArrayList<>();

    @OneToMany(
            mappedBy = "month",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<RecurringExpense> recurringExpenses = new ArrayList<>();

    public String getMonthKey() {
        return monthKey;
    }

    public void setMonthKey(String monthKey) {
        this.monthKey = monthKey;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public List<RecurringExpense> getRecurringExpenses() {
        return recurringExpenses;
    }

    public void setRecurringExpenses(List<RecurringExpense> recurringExpenses) {
        this.recurringExpenses = recurringExpenses;
    }
}
