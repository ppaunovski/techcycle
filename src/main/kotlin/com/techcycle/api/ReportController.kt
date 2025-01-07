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
        @RequestParam startDate: LocalDate?,
        @RequestParam endDate: LocalDate?,
        @RequestParam filters: Map<String, String>?
    ): ReportResponse {
        return reportService.generateAdHocReport(type, startDate, endDate, filters)
    }

//    @GetMapping("/history")
//    fun getReportHistory(
//        @RequestParam(defaultValue = "0") page: Int,
//        @RequestParam(defaultValue = "20") size: Int
//    ): Page<ReportResponse> {
//        return reportService.getReportHistory(page, size)
//    }
}