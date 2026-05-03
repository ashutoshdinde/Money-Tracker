package com.example.demo.dto;

import java.math.BigDecimal;

public class DashboardDTO {
    private BigDecimal totalAllocated;
    private BigDecimal totalSpent;
    private BigDecimal netSavings;

    public DashboardDTO(BigDecimal totalAllocated, BigDecimal totalSpent, BigDecimal netSavings) {
        this.totalAllocated = totalAllocated;
        this.totalSpent = totalSpent;
        this.netSavings = netSavings;
    }

    public BigDecimal getTotalAllocated() { return totalAllocated; }
    public void setTotalAllocated(BigDecimal totalAllocated) { this.totalAllocated = totalAllocated; }
    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }
    public BigDecimal getNetSavings() { return netSavings; }
    public void setNetSavings(BigDecimal netSavings) { this.netSavings = netSavings; }
}
