package com.subguard.Filter;

import com.subguard.Util.JwtUtil;
import com.subguard.service.CustomUserDetailService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    CustomUserDetailService customUserDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       String authHeader = request.getHeader("Authorization");
       String token = null;
       String username = null;

       if(authHeader != null && authHeader.startsWith("Bearer ")){
           token = authHeader.substring(7);
           username = jwtUtil.extractUsername(token);
       }

       if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
           UserDetails userDetails = customUserDetailService.loadUserByUsername(username);

           if(jwtUtil.validate(username , userDetails, token)){
                UsernamePasswordAuthenticationToken authToken =  new UsernamePasswordAuthenticationToken(userDetails , null , userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);
           }
       }

       filterChain.doFilter(request, response);

    }
}
