package com.techcycle

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TechCycleApplication

fun main(args: Array<String>) {
    runApplication<TechCycleApplication>(*args)
}
