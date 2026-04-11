package com.clothmarket.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class SignUpRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotBlank(message = "Mobile number is required")
    private String mobile;
    
    @NotBlank(message = "Password is required")
    private String password;
}
