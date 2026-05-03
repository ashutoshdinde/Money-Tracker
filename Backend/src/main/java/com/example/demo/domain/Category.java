package com.example.demo.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;

@Entity
@Table(
        name = "categories",
        uniqueConstraints = @UniqueConstraint(name = "uk_categories_month_key", columnNames = {"month_key", "category_key"})
)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long internalId;

    @Column(name = "category_key", nullable = false, length = 128)
    @JsonProperty("id")
    private String categoryKey;

    @Column(nullable = false)
    private String name;

    private BigDecimal amount;

    @Column(name = "is_custom")
    @JsonProperty("isCustom")
    private boolean custom;

    @JsonProperty("starred")
    private boolean starred;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "month_key", referencedColumnName = "month_key", nullable = false)
    @JsonIgnore
    private MonthData month;

    public Long getInternalId() {
        return internalId;
    }

    public void setInternalId(Long internalId) {
        this.internalId = internalId;
    }

    public String getCategoryKey() {
        return categoryKey;
    }

    public void setCategoryKey(String categoryKey) {
        this.categoryKey = categoryKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public boolean isCustom() {
        return custom;
    }

    public void setCustom(boolean custom) {
        this.custom = custom;
    }

    public boolean isStarred() {
        return starred;
    }

    public void setStarred(boolean starred) {
        this.starred = starred;
    }

    public MonthData getMonth() {
        return month;
    }

    public void setMonth(MonthData month) {
        this.month = month;
    }
}
