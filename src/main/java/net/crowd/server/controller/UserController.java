package net.crowd.server.controller;

import net.crowd.server.entity.User;
import net.crowd.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    //

    @Autowired
    UserService userService;

    @PostMapping("users")
    public User createUser(@RequestBody User user){
        return userService.registerUser(user);
    }

    @GetMapping("users/{phoneNumber}")
    public User retrieveUserByPhoneNumber(@PathVariable String phoneNumber){
        return userService.getUserByPhoneNumber(phoneNumber);
    }
}
