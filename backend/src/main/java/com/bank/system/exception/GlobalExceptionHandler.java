package com.bank.system.exception;

import com.bank.system.dto.response.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .errorCode("RESOURCE_NOT_FOUND")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateResourceException(
            DuplicateResourceException ex, HttpServletRequest request) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .errorCode("DUPLICATE_RESOURCE")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequestException(
            BadRequestException ex, HttpServletRequest request) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("BAD_REQUEST")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiErrorResponse> handleUnauthorizedException(
            UnauthorizedException ex, HttpServletRequest request) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .errorCode("UNAUTHORIZED")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex, HttpServletRequest request) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .errorCode("INVALID_CREDENTIALS")
                .message("Invalid username/email or password")
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .errorCode("ACCESS_DENIED")
                .message("You do not have permission to access this resource")
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("VALIDATION_FAILED")
                .message("Validation failed for request parameters")
                .path(request.getRequestURI())
                .errors(fieldErrors)
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .errorCode("INTERNAL_SERVER_ERROR")
                .message("An unexpected error occurred: " + ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
