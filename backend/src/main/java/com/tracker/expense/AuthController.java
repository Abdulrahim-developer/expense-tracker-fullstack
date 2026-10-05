package com.tracker.expense;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error , Email is already registered!");
        }


        String hashPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(hashPassword);

        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest){
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if(userOpt.isPresent()){
            User user = userOpt.get();
            if(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
                return ResponseEntity.ok(user);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid Email or Password!");
    }
}
