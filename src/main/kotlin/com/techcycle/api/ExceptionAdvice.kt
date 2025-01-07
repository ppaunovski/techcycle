package com.techcycle.api

import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.ErrorResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ExceptionAdvice {
    @ExceptionHandler(RuntimeException::class)
    fun handleServerException(e: RuntimeException): ResponseEntity<ErrorResponse> =
        ResponseEntity.internalServerError()
            .body(ErrorResponse.create(e, HttpStatus.INTERNAL_SERVER_ERROR, e.message ?: "Internal Server Error"))

}