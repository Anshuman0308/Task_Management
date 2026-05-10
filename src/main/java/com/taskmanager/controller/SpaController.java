package com.taskmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Forward all non-API routes to React's index.html
    @GetMapping(value = {"/", "/login", "/signup", "/dashboard", "/projects", "/tasks", "/members"})
    public String forward() {
        return "forward:/index.html";
    }
}
