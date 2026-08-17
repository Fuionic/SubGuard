package com.subguard.errorhandling;

public class UserLoginException extends RuntimeException {
    public UserLoginException(String message) {
        super(message);
    }
}
