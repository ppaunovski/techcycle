package com.techcycle.repository

import com.techcycle.domain.Address
import org.springframework.data.jpa.repository.JpaRepository

interface AddressRepository: JpaRepository<Address, Long> {

}
