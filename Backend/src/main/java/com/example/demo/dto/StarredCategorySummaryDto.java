package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class StarredCategorySummaryDto {

    private String categoryId;
    private String categoryName;
    private BigDecimal totalAllocated;
    private List<StarredCategoryMonthDto> byMonth = new ArrayList<>();

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getTotalAllocated() {
        return totalAllocated;
    }

    public void setTotalAllocated(BigDecimal totalAllocated) {
        this.totalAllocated = totalAllocated;
    }

    public List<StarredCategoryMonthDto> getByMonth() {
        return byMonth;
    }

    public void setByMonth(List<StarredCategoryMonthDto> byMonth) {
        this.byMonth = byMonth;
    }
}
