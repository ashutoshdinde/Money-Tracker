package com.example.demo.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String note;
    private BigDecimal amount;
    private OffsetDateTime date;
    private String category;
    private String monthKey;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public OffsetDateTime getDate() { return date; }
    public void setDate(OffsetDateTime date) { this.date = date; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getMonthKey() { return monthKey; }
    public void setMonthKey(String monthKey) { this.monthKey = monthKey; }
}
