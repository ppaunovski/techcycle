package com.techcycle.config.security

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "resrf.security.jwt")
class JwtConfiguration {
    var secretKey: String = "05332b7e2b0103d22369b794d7479165bc26c82e3cd1cc2426cb5768ec5d4cad26472e28798cdc36bcb42942d03f3b5c81bdedbf78d09dcbe435c737cf519152f6d15859727216d6cad928f9b0b7acda22f3d8e83443d675c1b7f3c6bcbdc97a4ee3b2a7f36970afa3c61db3f34adbf625f5022847e747a80de7eb0cb5d3cced582ef9e35368f7a6ea09160f753196fefd1aa01349493c2791d8c07f77c69500ce56c87686f86aeb8e2408ca034133098d405829933d32cb64c82616fec1e346598d365fd78c189ec5316893c33a50109815e97b48f06716fcf0ec9725b7aea90804aea82d55a48138146499ce0666c832cd4ccb687aaff50723b4792bfc5acd"
    var duration: Long = 1000*60*60*24
    var refreshDuration: Long = 0
}