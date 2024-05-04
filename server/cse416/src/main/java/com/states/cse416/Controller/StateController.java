package com.states.cse416.Controller;

import com.states.cse416.Models.State;
import com.states.cse416.Models.StateAssembly;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Service.StateService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class StateController {
    @Autowired
    private StateService stateService;

    @GetMapping("/stateTable/{state}")
    public ResponseEntity<List<State>> getStateData(@PathVariable StateName state) {
        return new ResponseEntity<>(stateService.getStateWideData(state), HttpStatus.OK);
    }

    @GetMapping("/stateAssemblyTable/{stateName}")
    public ResponseEntity<List<StateAssembly>> getAssemblyStateTable(@PathVariable StateName stateName) {
        return new ResponseEntity<>(stateService.getTableByState(stateName), HttpStatus.OK);
    }
}

