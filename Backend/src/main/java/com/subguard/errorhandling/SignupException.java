package com.subguard.errorhandling;

public class SignupException extends RuntimeException {
    public SignupException(String message) {
        super(message);
    }
}
