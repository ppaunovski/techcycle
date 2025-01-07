package com.techcycle.repository

import com.techcycle.domain.view.BestsellersView
import org.springframework.data.jpa.repository.JpaRepository

interface BestsellersRepository: JpaRepository<BestsellersView, Long> {

}
