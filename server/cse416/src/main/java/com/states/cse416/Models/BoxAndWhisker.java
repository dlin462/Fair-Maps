package com.states.cse416.Models;

import com.states.cse416.Models.enums.Party;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import lombok.Data;

@Data
public class BoxAndWhisker {
    private String name;
    private Party party;
    private StateName state;
    private Race race;
    private double[] data;
}
