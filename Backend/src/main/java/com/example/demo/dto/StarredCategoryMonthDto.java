package com.example.demo.dto;

import java.math.BigDecimal;

public class StarredCategoryMonthDto {

    private String monthKey;
    private BigDecimal allocated;

    public StarredCategoryMonthDto() {
    }

    public StarredCategoryMonthDto(String monthKey, BigDecimal allocated) {
        this.monthKey = monthKey;
        this.allocated = allocated;
    }

    public String getMonthKey() {
        return monthKey;
    }

    public void setMonthKey(String monthKey) {
        this.monthKey = monthKey;
    }

    public BigDecimal getAllocated() {
        return allocated;
    }

    public void setAllocated(BigDecimal allocated) {
        this.allocated = allocated;
    }
}
