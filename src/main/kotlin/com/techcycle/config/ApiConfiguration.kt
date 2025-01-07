package com.techcycle.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "techcycle.api")
class ApiConfiguration {
    val host: String = "localhost"
}