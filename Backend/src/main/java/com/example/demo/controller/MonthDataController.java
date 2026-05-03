package com.example.demo.controller;

import com.example.demo.dto.MonthDataRequest;
import com.example.demo.dto.MonthDataResponse;
import com.example.demo.service.MonthDataService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/months")
public class MonthDataController {

    private final MonthDataService monthDataService;

    public MonthDataController(MonthDataService monthDataService) {
        this.monthDataService = monthDataService;
    }

    @GetMapping("/{monthKey}")
    public MonthDataResponse getMonthData(@PathVariable String monthKey) {
        return monthDataService.getMonthData(monthKey);
    }

    @PutMapping("/{monthKey}")
    public MonthDataResponse saveMonthData(@PathVariable String monthKey, @RequestBody MonthDataRequest request) {
        return monthDataService.saveMonthData(monthKey, request);
    }
}
