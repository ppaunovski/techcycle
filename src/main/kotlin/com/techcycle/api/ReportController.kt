package com.techcycle.api

import com.techcycle.service.AdHocReportType
import com.techcycle.service.RegularReportType
import com.techcycle.service.ReportResponse
import com.techcycle.service.ReportService
import org.springframework.data.domain.Page
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.time.LocalDate

@RestController
@RequestMapping("/api/reports")
class ReportController(private val reportService: ReportService) {

    @GetMapping("/regular/{type}")
    fun getRegularReport(
        @PathVariable type: RegularReportType,
        @RequestParam startDate: Instant,
        @RequestParam endDate: Instant
    ): ReportResponse {
        return reportService.generateRegularReport(type, startDate, endDate)
    }

    @GetMapping("/adhoc/{type}")
    fun getAdHocReport(
        @PathVariable type: AdHocReportType,
        @RequestParam startDate: Instant,
    ): ReportResponse {
        return reportService.generateAdHocReport(type, startDate)
    }








}