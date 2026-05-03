package com.example.demo.controller;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.dto.StarredCategorySummaryDto;
import com.example.demo.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardDTO getDashboardData() {
        return dashboardService.getDashboardData();
    }

    @GetMapping("/starred-allocations")
    public List<StarredCategorySummaryDto> getStarredAllocations() {
        return dashboardService.getStarredCategoryAllocationTotals();
    }
}
