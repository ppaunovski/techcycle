package com.techcycle.api

import com.techcycle.service.DataSimulator
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/simulator")
class Simulator(
    private val simulator: DataSimulator
) {
    @GetMapping
    fun simulator() = simulator.simulateData()
}