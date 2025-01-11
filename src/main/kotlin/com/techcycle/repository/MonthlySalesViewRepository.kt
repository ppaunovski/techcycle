package com.techcycle.repository

import com.techcycle.domain.view.MonthlySalesView
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface MonthlySalesViewRepository: JpaRepository<MonthlySalesView, Long> {
    @Query(value = "select msv from MonthlySalesView msv where msv.year is null or msv.year = :year")
    fun findAllOnYearlyBasis(year: Int): List<MonthlySalesView>
}