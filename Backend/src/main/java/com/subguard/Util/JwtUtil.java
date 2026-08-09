package com.subguard.Util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final long Expiration_Time = 1000 * 60* 60;
    private final String key = "YourKey";
    private  final SecretKey secret = Keys.hmacShaKeyFor(key.getBytes());

    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + Expiration_Time) )
                .signWith(secret, SignatureAlgorithm.HS256)
                .compact();

    }
}
