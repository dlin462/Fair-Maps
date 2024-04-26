package com.states.cse416.Models;

import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class State {
    @Id
    private ObjectId id;
    private StateName name;
    private int totalPop;

    @DocumentReference
    private List<District> districtsList;
}
