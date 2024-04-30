package com.states.cse416.Controller;

import com.states.cse416.Models.State;
import com.states.cse416.Models.StateAssembly;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Service.StateAssemblyService;
import com.states.cse416.Service.StateWideDataService;
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
    private StateWideDataService stateWideDataService;

    @Autowired
    private StateAssemblyService stateAssemblyService;

    @GetMapping("/stateTable")
    public ResponseEntity<List<State>> getStateTable() {
        return new ResponseEntity<>(stateWideDataService.getTable(), HttpStatus.OK);
    }

    @GetMapping("/stateAssemblyTable/{stateName}")
    public ResponseEntity<List<StateAssembly>> getAssemblyStateTable(@PathVariable String stateName) {
        return new ResponseEntity<>(stateAssemblyService.getTableByState(stateName), HttpStatus.OK);
    }
}
