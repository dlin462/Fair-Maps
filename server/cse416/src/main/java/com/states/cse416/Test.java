package com.states.cse416;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class Test {

  @GetMapping("/map/texas")
  public String test1 () {
   return "showing Texas";
  }  

  @GetMapping("/map/california")
  public String test2 () {
   return "showing California";
  }  

}
