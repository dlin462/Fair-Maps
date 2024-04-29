package com.states.cse416;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/map")
public class TestController {

  @GetMapping("/mississippi")
  public ResponseEntity<String> test1 () {
   return new ResponseEntity<>("showing mississippi", HttpStatus.OK);
  }  

  @GetMapping("/nevada")
  public ResponseEntity<String> test2 () {
   return new ResponseEntity<>("showing nevada", HttpStatus.OK);
  }  

}
